const exams = [
  // ===== Exam 1 =====
  {
    id:1,
    type: "intern",
    name: "اختبار القبول – متدربين (دفعة 1)",
    duration: "45m",
    sections: [
      {
        id: 1,
        name: "القراءة والفهم",
        desc: "أسئلة الفهم والاستيعاب",
        questions: [
          {
            id: 1758301001001,
            type: "mcq",
            sectionId: 1,
            mcqSubType: "general",
            question: "ما الفكرة الرئيسة للفقرة التالية؟",
            passage:
              "يركّز النص على أهمية التعلم الذاتي في تطوير المهارات المهنية، وكيف يساعد تحديد الأهداف الصغيرة على الاستمرارية.",
            options: [
              "التعلم الذاتي يعيق التقدم",
              "الأهداف الصغيرة تعيق الاستمرارية",
              "التعلم الذاتي يطوّر المهارات المهنية",
              "تعلم جماعي فقط هو الأفضل"
            ],
            correctAnswerIndex: 2,
            points: 2,
            difficulty: "سهل",
            explanation: "النص يؤكد دور التعلم الذاتي والأهداف الصغيرة في التطور المهني."
          },
          {
            id: 1758301001002,
            type: "mcq",
            sectionId: 1,
            mcqSubType: "passage",
            question: "ما الخطوة الأولى التي يقترحها النص لبدء التعلم الذاتي؟",
            passage:
              "ابدأ بتحديد أهداف أسبوعية قابلة للقياس، ثم دوّن تقدّمك يوميًا لتصحيح المسار سريعًا.",
            options: [
              "الدراسة لساعات طويلة بلا توقف",
              "شراء دورات باهظة الثمن",
              "تحديد أهداف أسبوعية قابلة للقياس",
              "الاعتماد على الحفظ فقط"
            ],
            correctAnswerIndex: 2,
            points: 2,
            difficulty: "سهل"
          },
          {
            id: 1758301001003,
            type: "trueFalse",
            sectionId: 1,
            question: "يوصي النص بتجزئة الأهداف الكبيرة إلى مهام صغيرة.",
            correctAnswer: true,
            points: 1,
            difficulty: "سهل"
          },
          {
            id: 1758301001004,
            type: "essay",
            sectionId: 1,
            question: "اذكر فائدتين للتعلّم الذاتي مع مثال عملي لكل فائدة.",
            modelAnswer:
              "المرونة الزمنية (مثال: التعلم صباحًا/مساءً حسب الوقت المتاح)، التخصيص (مثال: اختيار مصادر تناسب المجال).",
            points: 5,
            difficulty: "متوسط"
          },
          {
            id: 1758301001005,
            type: "complete",
            sectionId: 1,
            question: "أكمل: كتابة ___ أسبوعية قابلة للقياس يعزّز ___.",
            text: "كتابة [أهداف] أسبوعية قابلة للقياس يعزّز [الاستمرارية].",
            blanks: ["أهداف", "الاستمرارية"],
            points: 2,
            difficulty: "سهل"
          }
        ]
      },
      {
        id: 2,
        name: "العلوم",
        desc: "أسئلة عامة وكيمياء",
        questions: [
          {
            id: 1758301002001,
            type: "mcq",
            sectionId: 2,
            mcqSubType: "chemical",
            question: "الرابطة الأيونية تحدث غالبًا بين:",
            options: [
              "لا فلزين",
              "فلز ولا فلز",
              "غازين نبيلين",
              "لا فلز وماء فقط"
            ],
            correctAnswerIndex: 1,
            points: 2,
            difficulty: "متوسط",
            explanation: "فلز يفقد إلكترونات ولا فلز يكتسبها."
          },
          {
            id: 1758301002002,
            type: "trueFalse",
            sectionId: 2,
            question: "تزداد ذائبية معظم المواد الصلبة بارتفاع درجة الحرارة.",
            correctAnswer: true,
            points: 1,
            difficulty: "سهل"
          },
          {
            id: 1758301002003,
            type: "complete",
            sectionId: 2,
            question: "أكمل: وحدة قياس القوة هي ___ ووحدة قياس الشغل هي ___.",
            text: "وحدة قياس القوة هي [النيوتن] ووحدة قياس الشغل هي [الجول].",
            blanks: ["النيوتن", "الجول"],
            points: 2,
            difficulty: "متوسط"
          }
        ]
      },
      {
        id: 3,
        name: "الرياضيات",
        desc: "تفكير كمي واستدلال",
        questions: [
          {
            id: 1758301003001,
            type: "mcq",
            sectionId: 3,
            mcqSubType: "general",
            question: "إذا كان 3x + 5 = 20 فما قيمة x؟",
            options: ["3", "4", "5", "6"],
            correctAnswerIndex: 2, // 5
            points: 2,
            difficulty: "سهل",
            explanation: "3x = 15 ⇒ x = 5."
          },
          {
            id: 1758301003002,
            type: "trueFalse",
            sectionId: 3,
            question: "مجموع زوايا المثلث 180 درجة.",
            correctAnswer: true,
            points: 1,
            difficulty: "سهل"
          },
          {
            id: 1758301003003,
            type: "complete",
            sectionId: 3,
            question: "أكمل: مشتقة x^2 هي ___ ومشتقة sin(x) هي ___.",
            text: "مشتقة x^2 هي [2x] ومشتقة sin(x) هي [cos(x)].",
            blanks: ["2x", "cos(x)"],
            points: 2,
            difficulty: "متوسط"
          }
        ]
      }
    ]
  },

  // ===== Exam 2 =====
  {
    id:2,
    type: "final",
    name: "الاختبار النهائي – أساسيات الحاسب",
    duration: "60m",
    sections: [
      {
        id: 1,
        name: "نظم التشغيل",
        desc: "أسئلة عامة حول أنظمة التشغيل",
        questions: [
          {
            id: 1758302001001,
            type: "mcq",
            sectionId: 1,
            mcqSubType: "general",
            question: "أي مما يلي ليس نظام تشغيل؟",
            options: ["لينكس", "ويندوز", "ماك أو إس", "HTTP"],
            correctAnswerIndex: 3,
            points: 1,
            difficulty: "سهل"
          },
          {
            id: 1758302001002,
            type: "trueFalse",
            sectionId: 1,
            question: "النواة (Kernel) هي قلب نظام التشغيل.",
            correctAnswer: true,
            points: 1,
            difficulty: "سهل"
          },
          {
            id: 1758302001003,
            type: "essay",
            sectionId: 1,
            question: "اشرح باختصار الفرق بين عمليات المعالجة المتعددة (Multitasking) والعمليات المتعددة (Multiprocessing).",
            modelAnswer:
              "المعالجة المتعددة: تشغيل عدة مهام بالتناوب على نفس المعالج. العمليات المتعددة: استخدام أكثر من معالج/نواة لتنفيذ مهام بالتوازي.",
            points: 4,
            difficulty: "متوسط"
          }
        ]
      },
      {
        id: 2,
        name: "الشبكات",
        desc: "مفاهيم شبكات الحاسوب",
        questions: [
          {
            id: 1758302002001,
            type: "mcq",
            sectionId: 2,
            mcqSubType: "general",
            question: "طبقة النقل في نموذج OSI مسؤولة عن:",
            options: [
              "العناوين الفيزيائية",
              "التوجيه بين الشبكات",
              "التحكم في الجلسات",
              "تجزئة وإعادة تجميع البيانات وضمانها"
            ],
            correctAnswerIndex: 3,
            points: 2,
            difficulty: "متوسط"
          },
          {
            id: 1758302002002,
            type: "complete",
            sectionId: 2,
            question: "أكمل: بروتوكول ___ يعتمد على الاتصال و ___ لا يعتمد على الاتصال.",
            text: "بروتوكول [TCP] يعتمد على الاتصال و [UDP] لا يعتمد على الاتصال.",
            blanks: ["TCP", "UDP"],
            points: 2,
            difficulty: "متوسط"
          }
        ]
      },
      {
        id: 3,
        name: "أمن المعلومات",
        desc: "مبادئ الأمان",
        questions: [
          {
            id: 1758302003001,
            type: "trueFalse",
            sectionId: 3,
            question: "التشفير يضمن السرية لكنه لا يضمن سلامة البيانات.",
            correctAnswer: false,
            points: 1,
            difficulty: "متوسط",
            explanation: "توجد خوارزميات/آليات لضمان السرية وسلامة البيانات (مثل MAC/Hash)."
          },
          {
            id: 1758302003002,
            type: "mcq",
            sectionId: 3,
            mcqSubType: "general",
            question: "أي الآتي مثال على عامل مصادقة تملكه؟",
            options: ["كلمة مرور", "بصمة الإصبع", "رمز على هاتفك", "نمط وجه"],
            correctAnswerIndex: 2,
            points: 1,
            difficulty: "سهل"
          }
        ]
      }
    ]
  },

  // ===== Exam 3 =====
  {
    id:3,
    type: "intern",
    name: "اختبار تحديد المستوى – لغة إنجليزية",
    duration: "30m",
    sections: [
      {
        id: 1,
        name: "Grammar",
        desc: "قواعد اللغة",
        questions: [
          {
            id: 1758303001001,
            type: "mcq",
            sectionId: 1,
            mcqSubType: "general",
            question: "Choose the correct form: She ___ to school every day.",
            options: ["go", "goes", "is go", "going"],
            correctAnswerIndex: 1,
            points: 1,
            difficulty: "سهل"
          },
          {
            id: 1758303001002,
            type: "complete",
            sectionId: 1,
            question: "Complete: I have ___ apple and ___ orange.",
            text: "I have [an] apple and [an] orange.",
            blanks: ["an", "an"],
            points: 2,
            difficulty: "سهل"
          }
        ]
      },
      {
        id: 2,
        name: "Reading",
        desc: "قراءة واستيعاب",
        questions: [
          {
            id: 1758303002001,
            type: "mcq",
            sectionId: 2,
            mcqSubType: "passage",
            question: "What is the main idea of the paragraph?",
            passage:
              "Online learning provides flexibility for learners to access materials anytime, allowing them to balance study with work or family.",
            options: [
              "Online learning is expensive",
              "Online learning is flexible",
              "Online learning replaces teachers",
              "Online learning is ineffective"
            ],
            correctAnswerIndex: 1,
            points: 2,
            difficulty: "سهل"
          },
          {
            id: 1758303002002,
            type: "trueFalse",
            sectionId: 2,
            question: "According to the text, online learning can help balance study with work.",
            correctAnswer: true,
            points: 1,
            difficulty: "سهل"
          }
        ]
      },
      {
        id: 3,
        name: "Writing",
        desc: "كتابة قصيرة",
        questions: [
          {
            id: 1758303003001,
            type: "essay",
            sectionId: 3,
            question: "Write a short paragraph (50–70 words) about your daily routine.",
            modelAnswer:
              "Sample points: time you wake up, commute or study, meals, exercise, hobbies, and bedtime.",
            points: 5,
            difficulty: "متوسط"
          }
        ]
      }
    ]
  }
];

export default exams;
