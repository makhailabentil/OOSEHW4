import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';
import Profile from '../components/Profile';

export default function Home() {
  const { user, login, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching notes for user:', user.uid);
      
      const res = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${user.uid}`
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Fetched notes:', data);
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error in fetchNotes:', error);
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
      // Check if first visit
      const visited = localStorage.getItem(`visited_${user.uid}`);
      if (!visited) {
        setIsFirstVisit(true);
        localStorage.setItem(`visited_${user.uid}`, 'true');
      }
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user]);

  const handleNewNote = async (note) => {
    try {
      await fetchNotes(); // Refresh notes after creating a new one
    } catch (error) {
      console.error('Error handling new note:', error);
      setError('Failed to refresh notes');
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.uid}`,
          'Cache-Control': 'no-cache'
        }
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse response:', e);
        if (res.ok) {
          await fetchNotes();
          return;
        }
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete note');
      }

      await fetchNotes();
    } catch (error) {
      console.error('Delete operation failed:', error);
      setError(`Failed to delete note: ${error.message}`);
    }
  };

  const handleEdit = (note) => {
    console.log('Setting note for edit:', note);
    setEditingNote(note);
  };

  const handleUpdate = async (updatedNote) => {
    try {
      const res = await fetch(`/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.uid}`,
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(updatedNote)
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse response:', e);
        if (res.ok) {
          setEditingNote(null);
          await fetchNotes();
          return;
        }
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update note');
      }

      setEditingNote(null);
      await fetchNotes();
    } catch (error) {
      console.error('Update operation failed:', error);
      setError(`Failed to update note: ${error.message}`);
    }
  };

  return (
    <div className="notebook-background">
      <Head>
        <title>DevNotes</title>
        <meta name="description" content="A Tron-inspired note-taking app" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </Head>

      <div className="cyber-paper">
        <div className="spiral-binding"></div>
        <div className="margin-line"></div>
        <div className="cyber-content min-h-screen flex justify-center items-center">
          <main className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="w-8"></div>
              <h1 className="text-7xl text-center text-[#22b0b0]">
                {"DevNotes"}
              </h1>
              {user ? (
                <Profile />
              ) : (
                <div className="w-8"></div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-[#22b0b0]">{'>'} LOADING_</p>
              </div>
            ) : !user ? (
              <div className="text-center py-12">
                <h1 className="text-5xl text-center text-[#22b0b0] mb-12 italic text-glow">
                  {"Start Taking Notes Here!"}
                </h1>
                <div className="code-logo mb-20">
                  <img 
                    src="/logo.png" 
                    alt="DevNotes Logo" 
                    className="w-77 h-77 mx-auto filter-cyan hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h2 className="text-2xl mb-6 text-[#22b0b0]">{'>'} ACCESS_REQUIRED</h2>
                <button onClick={login} className="console-button">
                  {'>'} LOGIN_WITH_GOOGLE
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="text-red-500 text-center mb-4">
                    {error}
                  </div>
                )}
                <div className="mb-8">
                  <NoteForm 
                    onSubmit={editingNote ? handleUpdate : handleNewNote} 
                    user={user} 
                    initialData={editingNote}
                  />
                </div>
                <div className="border-t border-gray-200 my-8"></div>
                <NoteList 
                  notes={notes} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
