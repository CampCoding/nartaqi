import React from 'react'
import TextArea from './ExamTextarea'

export default function EssayQuestions({modalAnswer , setModalAnswer}) {
  return (
     <TextArea
                      label="الإجابة النموذجية"
                      placeholder="أدخل الإجابة النموذجية هنا..."
                      rows={4}
                      value={modalAnswer}
                      onChange={(e) => setModalAnswer(e.target.value)}
                    />
  )
}
