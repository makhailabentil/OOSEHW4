import { format } from 'date-fns';
import { useState } from 'react';
import Pagination from './Pagination';

export default function NoteList({ notes, onDelete, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 5;
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to clean HTML tags for preview
  const cleanContent = (html) => {
    // Remove HTML tags but preserve line breaks
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .trim();
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cleanContent(note.content).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination values
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedNote(null); // Reset selected note when changing pages
  };

  // Helper function to check if a note has been edited
  const isNoteEdited = (note) => {
    return note.updatedAt && 
      new Date(note.updatedAt).getTime() > (new Date(note.createdAt).getTime() + 1000); // Add 1 second buffer
  };

  // Add this debug log
  const handleEditClick = (note) => {
    console.log('Edit button clicked:', note); // Debug log
    if (onEdit) {
      onEdit(note);
    }
  };

  if (!notes?.length) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="console-box">
          <p className="text-center">{'>'} NO_NOTES_FOUND_</p>
        </div>
      </div>
    );
  }

  if (selectedNote) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="console-box">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => setSelectedNote(null)}
              className="console-button"
            >
              {'<'} BACK
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => handleEditClick(selectedNote)}
                className="console-button"
              >
                {'>'} EDIT
              </button>
              <button 
                onClick={() => {
                  onDelete(selectedNote._id);
                  setSelectedNote(null);
                }}
                className="console-button text-red-400 border-red-400 hover:bg-red-400/10"
              >
                {'>'} DELETE
              </button>
            </div>
          </div>
          <h2 className="text-2xl mb-4">{'>'} {selectedNote.title}_</h2>
          <div 
            className="mt-4 opacity-90 note-content" 
            dangerouslySetInnerHTML={{ __html: selectedNote.content }}
          />
          <div className="mt-6 text-sm opacity-70">
            <p>{'>'} CREATED_{format(new Date(selectedNote.createdAt), 'MMM-dd-yyyy_hh:mm:ss_aa')}_</p>
            {isNoteEdited(selectedNote) && (
              <p className="mt-1">
                {'>'} EDITED_{format(new Date(selectedNote.updatedAt), 'MMM-dd-yyyy_hh:mm:ss_aa')}_
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="console-box">
        <h2 className="text-lg mb-6">{'>'} SAVED_NOTES </h2>
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="{'>'} SEARCH_NOTES_"
            className="console-input w-full"
          />
        </div>
        <div className="space-y-4">
          {currentNotes.map((note) => (
            <div 
              key={note._id} 
              className="note-card cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => setSelectedNote(note)}
            >
              <h3 className="text-lg">{'>'} {note.title}_</h3>
              <p className="mt-2 opacity-90 line-clamp-2">
                {cleanContent(note.content)}
              </p>
              <p className="mt-2 text-sm opacity-70">
                {'>'} Posted: {format(new Date(note.createdAt), 'MMM-dd-yyyy_hh:mm:ss_aa')} 
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {filteredNotes.length > notesPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}