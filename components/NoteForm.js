import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill and configure modules
const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import('react-quill');
  const { default: ImageResize } = await import('quill-image-resize-module-react');
  
  // Register Quill modules
  if (typeof window !== 'undefined') {
    RQ.Quill.register('modules/imageResize', ImageResize);
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [
        '#27f7f7',  // Tron Blue 
        '#FFFFFF', // White
        '#000000', // Black 
        '#FF0000', // Red)
        '#0000FF', // Blue
        '#00FF00', // Green
        '#FF4D00', // Orange
        '#62006D', // Purple
        '#808080', // Gray
        '#000749', // Navy Blue
        '#FFFF00', // Yellow
        '#FF0099' // Pink
      ] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    imageResize: {
      parchment: RQ.Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  };

  return function Component({ forwardedRef, ...props }) {
    return <RQ ref={forwardedRef} {...props} modules={modules} />;
  };
}, { ssr: false });

export default function NoteForm({ onSubmit, user, initialData }) {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [content, setContent] = useState(initialData ? initialData.content : '');
  const [error, setError] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const compressImage = async (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.src = dataUrl;
    });
  };

  const processContent = async (htmlContent) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    
    const images = div.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.src.startsWith('data:image')) {
        try {
          const compressedDataUrl = await compressImage(img.src);
          img.src = compressedDataUrl;
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      }
    }
    
    return div.innerHTML;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const processedContent = await processContent(content);
      
      const url = initialData 
        ? `/api/notes/${initialData._id}`
        : '/api/notes';
      
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.uid}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: processedContent
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      onSubmit && onSubmit(data);
      
      if (!initialData) {
        setTitle('');
        setContent('');
      }
      setError(null);
    } catch (error) {
      console.error('Error saving note:', error);
      setError(`Failed to save note: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="console-box space-y-6">
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {"> ERROR_"} {error}
          </div>
        )}
        <div>
          <label className="block text-sm mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="console-input"
            placeholder="Enter title..."
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Content</label>
          <div className="editor-wrapper">
            <ReactQuill
              forwardedRef={quillRef}
              value={content}
              onChange={setContent}
              theme="snow"
              placeholder="Enter content..."
              className="console-editor"
            />
          </div>
        </div>
        <button type="submit" className="console-button mt-4">
          {initialData ? '> UPDATE_NOTE' : '> SAVE_NOTE'}
        </button>
      </div>
    </form>
  );
}
