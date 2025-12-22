import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Official build

import './MathTypeEditor.css';

function MathTypeEditor() {
  const [editorData, setEditorData] = useState(
    '<p>اكتب معادلة رياضية هنا... / Write a mathematical equation here...</p>'
  );
  const [isRTL, setIsRTL] = useState(true);

  // CKEditor configuration with MathType plugin
  const editorConfiguration = {
    language: 'ar',
    
    toolbar: {
      items: [
        'heading',
        '|',
        'MathType', // This will appear in the toolbar
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'blockQuote',
        'insertTable',
        '|',
        'undo',
        'redo',
      ],
    },

  };

  return (
    <div className="math-editor-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="editor-header">
        <h2>MathType Editor with Arabic Support</h2>
        <p className="subtitle">محرر المعادلات مع دعم العربية</p>
        <div className="controls">
          <label>
            <input
              type="checkbox"
              checked={isRTL}
              onChange={(e) => setIsRTL(e.target.checked)}
            />
            {isRTL ? 'الوضع من اليمين لليسار (RTL)' : 'Right-to-Left (RTL) Mode'}
          </label>
        </div>
      </div>

      <div className="editor-section">
        <h3>{isRTL ? 'محرر المعادلات' : 'Math Editor'}</h3>
        <p className="instructions">
          {isRTL
            ? 'انقر على زر MathType لإدراج معادلة رياضية'
            : 'Click the MathType button to insert a mathematical equation'}
        </p>
        <div className="ckeditor-wrapper">
          <CKEditor
             editor={ClassicEditor}
             config={editorConfiguration}
             data={editorData}
             onReady={(editor) => {
               console.log('CKEditor is ready to use!', editor);
               try {
                console.log('Available toolbar items:', Array.from(editor.ui.componentFactory.names()));

                 // Set editor direction
                 if (editor && editor.editing && editor.editing.view) {
                   editor.editing.view.document.dir = isRTL ? 'rtl' : 'ltr';
                 }
               } catch (error) {
                 console.warn('Error setting editor direction:', error);
               }
             }}
             onChange={(event, editor) => {
               try {
                 if (editor) {
                   const data = editor.getData();
                   setEditorData(data);
                 }
               } catch (error) {
                 console.error('Error in onChange:', error);
               }
             }}
             onError={(error, { phase, willEditorRestart }) => {
               console.error('CKEditor error:', error, phase, willEditorRestart);
             }}
          />
        </div>
      </div>

      <div className="display-section">
        <h3>{isRTL ? 'المحتوى' : 'Content'}</h3>
        <div
          className="content-display"
          dir={isRTL ? 'rtl' : 'ltr'}
          dangerouslySetInnerHTML={{ __html: editorData }}
        />
      </div>

      {/* Info section remains the same */}
      <div className="info-section">
        <h3>{isRTL ? 'ميزات التدوين الرياضي العربي' : 'Arabic Math Notation Features'}</h3>
        <ul>
          <li>✓ {isRTL ? 'وضع الكتابة من اليمين لليسار (RTL)' : 'Right-to-Left (RTL) writing mode'}</li>
          {/* ... other items */}
        </ul>
      </div>
    </div>
  );
}

export default MathTypeEditor;