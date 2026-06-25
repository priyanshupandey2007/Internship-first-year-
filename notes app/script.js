const notesWrapper = document.getElementById('notes-wrapper');
const addBtn = document.getElementById('add-btn');

// 1. Data Persistence (Read phase of CRUD)
let notes = JSON.parse(localStorage.getItem('saved-notes')) || [];

// 2. Core Rendering Function
function renderNotes() {
    notesWrapper.innerHTML = ''; // Wipe container clean

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note-card');

        noteElement.innerHTML = `
            <textarea class="note-textarea" placeholder="Take a note...">${note.content}</textarea>
            <div class="note-footer">
                <span>${note.date}</span>
                <button class="delete-note-btn">Delete</button>
            </div>
        `;

        const textarea = noteElement.querySelector('.note-textarea');
        const deleteButton = noteElement.querySelector('.delete-note-btn');

        // 3. Update Phase (CRUD) - Listen to text typing changes
        textarea.addEventListener('input', (e) => {
            updateNote(note.id, e.target.value);
        });

        // 4. Delete Phase (CRUD)
        deleteButton.addEventListener('click', () => {
            deleteNote(note.id);
        });

        notesWrapper.appendChild(noteElement);
    });
}

// 5. Create Phase (CRUD)
function addNote() {
    const newNote = {
        id: Math.floor(Math.random() * 1000000),
        content: '',
        date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    };

    notes.unshift(newNote); // Put newest note card at front
    saveToLocalStorage();
    renderNotes();
}

// Helper: Sync modified content string back to array object
function updateNote(id, updatedContent) {
    const targetNote = notes.find(note => note.id === id);
    if (targetNote) {
        targetNote.content = updatedContent;
        saveToLocalStorage(); // Silent save behind the scenes
    }
}

// Delete helper logic
function deleteNote(id) {
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
        notes = notes.filter(note => note.id !== id);
        saveToLocalStorage();
        renderNotes();
    }
}

// Local Storage Helper
function saveToLocalStorage() {
    localStorage.setItem('saved-notes', JSON.stringify(notes));
}

// Event Listeners & Bootstrapping
addBtn.addEventListener('click', addNote);

// Paint existing items onto screen at startup
renderNotes();