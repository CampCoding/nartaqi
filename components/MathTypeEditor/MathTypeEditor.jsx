"use client"
import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-classic-with-mathtype';
import './MathTypeEditor.css';

function MathTypeEditor({editorData = '<p></p>', setEditorData}) {
  const [isRTL, setIsRTL] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    return () => setReady(false);
  }, []);

  if (!ready) return null;
  const editorConfiguration = {
    language: 'ar', 
    toolbar: {
      items: [
        'heading',
        'MathType',
        'ChemType',
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
        'redo'
      ]
    }
  };



  return (
    <div className="math-editor-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <CKEditor
            editor={ClassicEditor}
            config={editorConfiguration}
            data={editorData}
            placeholder="اكتب هنا…"
            className="!w-full border border-gray-200"
            style={{ fontSize: "14px", minHeight: "48px", width: "100%", textAlign: "right" }}
            // I want to change confirm button text
            toolbarConfirmButtonLabel="تأكيد"
            toolbarCancelButtonLabel="إلغاء"
            toolbarUndoButtonLabel="تراجع"
            toolbarRedoButtonLabel="إعادة"
            toolbarBoldButtonLabel="عريض"
            toolbarItalicButtonLabel="مائل"
            toolbarUnderlineButtonLabel="تحتي"
            toolbarStrikethroughButtonLabel="مشطوب"
            toolbarSuperscriptButtonLabel="رفع"
            toolbarSubscriptButtonLabel="خفض"
            onReady={(editor) => {
              console.log('CKEditor is ready to use!', editor);
              try {
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
  );
}

export default MathTypeEditor;
