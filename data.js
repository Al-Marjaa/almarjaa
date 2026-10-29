/* =====================================================================
   SITE CONFIG + SERVICES DATA (English / Arabic)
   Edit this file to change your name, contacts, services and documents.
   ===================================================================== */

window.SITE = {
  brand: "Al Marjaa",
  brandAr: "المرجع",
  phone: "+961 76 138 537",
  whatsapp: "96176138537",             // digits only, with country code
  email: "oliviadiaasayah@gmail.com",
  address: "Baabda, Mount Lebanon",
  addressAr: "بعبدا، جبل لبنان",
  hours: "Mon–Fri 8:30–17:00 · Sat 9:00–13:00",
  hoursAr: "الاثنين–الجمعة 8:30–17:00 · السبت 9:00–13:00",

  /* Google backend — accounts, uploads, tracking (see README).
     Paste the Apps Script web-app URL (ends in /exec). Until it is set, the form
     falls back to emailing inquiries. */
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbxByx78mUwoBaOk8TzyXGbxFTDyauhRFBPU4bu7WmjocWKvdbyq0kBK_BRQKQtw8Ojp/exec",

  maxUploadMB: 25                      // total size of all attachments per inquiry
};

/* Each service:
   id, title, ar, color, icon, blurb, blurbAr,
   subs: [{ name, ar, docs: [ ["English", "العربية"], ... ] }]
   Document lists are a general guide — requirements change, always confirm. */

window.SERVICES = [
  {
    id: "commercial",
    title: "Commercial Register",
    ar: "السجل التجاري",
    color: "#c9a96e",
    icon: "register",
    category: "business",
    goal: "Start or register a business",
    goalAr: "تأسيس أو تسجيل عمل تجاري",
    authority: "Commercial Register — Ministry of Justice (regional registries)",
    authorityAr: "السجل التجاري — وزارة العدل (أمانات السجل في المناطق)",
    overview: "Every trader and company doing business in Lebanon must be registered with the Commercial Register, kept by the registries of the courts under the Ministry of Justice. We prepare your file, arrange signatures and notarisation where needed, submit it and follow it up until your registration certificate is issued.",
    overviewAr: "يجب على كل تاجر وشركة تعمل في لبنان التسجيل في السجل التجاري لدى أمانات السجل في المحاكم التابعة لوزارة العدل. نحضّر ملفك، ونرتّب التواقيع والتصديق عند الحاجة، ونقدّمه ونتابعه حتى صدور إفادة التسجيل.",
    blurb: "Register a trader, an establishment or a company (SARL, SAL, Holding, Offshore) and handle amendments.",
    blurbAr: "تسجيل تاجر أو مؤسسة أو شركة (ش.م.م، ش.م.ل، هولدنغ، أوفشور) وإجراء التعديلات.",
    subs: [
      {
        name: "Trader registration",
        ar: "تسجيل تاجر",
        docs: [
          ["Lebanese ID card or individual civil extract (less than 3 months old)", "بطاقة هوية لبنانية أو إخراج قيد فردي لا يتجاوز تاريخه 3 أشهر"],
          ["Recent judicial record", "سجل عدلي حديث"],
          ["Lease contract registered at the municipality, or title deed of the premises", "عقد إيجار مسجّل في البلدية أو سند ملكية المحل"],
          ["Signed registration request (Commercial Register form)", "طلب تسجيل موقّع (نموذج السجل التجاري)"],
          ["Signature specimen", "نموذج عن التوقيع"],
          ["Financial (tax) number certificate, if already issued", "إفادة الرقم المالي إن وُجدت"],
          ["2 passport-size photos", "صورتان شمسيتان"]
        ]
      },
      {
        name: "Establishment registration",
        ar: "تسجيل مؤسسة",
        docs: [
          ["Owner's ID card or individual civil extract (< 3 months)", "بطاقة هوية المالك أو إخراج قيد فردي (أقل من 3 أشهر)"],
          ["Owner's judicial record", "السجل العدلي للمالك"],
          ["Domiciliation document: registered lease, title deed or occupancy permit", "مستند المركز: عقد إيجار مسجّل أو سند ملكية أو إفادة إشغال"],
          ["Proposed trade name + description of the activity", "الاسم التجاري المقترح ووصف النشاط"],
          ["Signed registration request", "طلب تسجيل موقّع"],
          ["Financial (tax) number certificate, if available", "إفادة الرقم المالي إن وُجدت"],
          ["Any sector licence the activity requires (e.g. Health, Tourism)", "أي ترخيص قطاعي يتطلبه النشاط (مثل الصحة أو السياحة)"]
        ]
      },
      {
        name: "Company registration (SARL / SAL / Holding / Offshore)",
        ar: "تسجيل شركة (ش.م.م / ش.م.ل / هولدنغ / أوفشور)",
        docs: [
          ["Articles of association, signed and notarised", "النظام الأساسي موقّعاً ومصدّقاً لدى الكاتب العدل"],
          ["Bank certificate confirming deposit of the share capital", "إفادة مصرفية بإيداع رأس المال"],
          ["IDs or passports of all partners / shareholders", "هويات أو جوازات سفر جميع الشركاء / المساهمين"],
          ["IDs and judicial records of managers / board members", "هويات وسجلات عدلية للمدراء / أعضاء مجلس الإدارة"],
          ["Domiciliation documents: title deed, lease or occupancy permit", "مستندات المركز: سند ملكية أو عقد إيجار أو إفادة إشغال"],
          ["Registration request (Commercial Register form)", "طلب تسجيل (نموذج السجل التجاري)"],
          ["Commercial circular with authorised signatories", "التعميم التجاري مع نماذج تواقيع المفوّضين بالتوقيع"],
          ["SAL / Holding / Offshore: subscription deed + minutes of the first board meeting", "للـ ش.م.ل / هولدنغ / أوفشور: صك الاكتتاب ومحضر أول اجتماع لمجلس الإدارة"],
          ["Foreign shareholders: documents legalised and translated into Arabic", "للمساهمين الأجانب: مستندات مصدّقة ومترجمة إلى العربية"]
        ]
      },
      {
        name: "Amendments & certificates",
        ar: "تعديلات وإفادات",
        docs: [
          ["Commercial Register number of the trader / company", "رقم السجل التجاري للتاجر / الشركة"],
          ["Board or partners' resolution describing the change", "قرار مجلس الإدارة أو الشركاء بالتعديل"],
          ["ID of the authorised signatory", "هوية المفوّض بالتوقيع"],
          ["Supporting documents (new lease, share transfer deed, etc.)", "المستندات الداعمة (عقد إيجار جديد، عقد تفرّغ عن حصص، إلخ)"]
        ]
      }
    ]
  },
  {
    id: "nssf",
    title: "Social Security (NSSF)",
    ar: "الضمان الاجتماعي",
    color: "#7f9cc0",
    icon: "shield",
    category: "business",
    goal: "Register employees with social security",
    goalAr: "تسجيل الموظفين في الضمان الاجتماعي",
    authority: "National Social Security Fund (NSSF)",
    authorityAr: "الصندوق الوطني للضمان الاجتماعي",
    overview: "Employers in Lebanon register with the National Social Security Fund and enrol their employees. We handle employer registration, new employees, clearance certificates and end-of-service files, so your company stays in order.",
    overviewAr: "يسجّل أصحاب العمل في لبنان لدى الصندوق الوطني للضمان الاجتماعي ويسجّلون أجراءهم. نتولّى تسجيل صاحب العمل، والأجراء الجدد، وبراءات الذمة، وملفات نهاية الخدمة، لتبقى مؤسستك نظامية.",
    blurb: "Employer and employee registration, declarations, clearance certificates and end-of-service files.",
    blurbAr: "تسجيل أصحاب العمل والأجراء، التصاريح، براءات الذمة وملفات نهاية الخدمة.",
    subs: [
      {
        name: "Employer registration",
        ar: "تسجيل صاحب عمل",
        docs: [
          ["Commercial Register certificate", "إفادة تسجيل في السجل التجاري"],
          ["Financial (tax) number certificate", "إفادة الرقم المالي"],
          ["ID of the owner / authorised signatory", "هوية المالك / المفوّض بالتوقيع"],
          ["Lease contract or title deed of the workplace", "عقد إيجار أو سند ملكية مكان العمل"],
          ["List of employees with start dates and salaries", "لائحة بالأجراء مع تواريخ المباشرة والرواتب"],
          ["Signed NSSF employer registration form", "استمارة تسجيل صاحب عمل موقّعة"]
        ]
      },
      {
        name: "Employee enrolment",
        ar: "تسجيل أجير",
        docs: [
          ["Employee's individual civil extract (< 3 months)", "إخراج قيد فردي للأجير (أقل من 3 أشهر)"],
          ["Copy of the employee's ID card", "صورة عن بطاقة هوية الأجير"],
          ["Family civil extract — to add spouse / children", "إخراج قيد عائلي لإضافة الزوج/ة والأولاد"],
          ["Employment start declaration signed by the employer", "تصريح مباشرة عمل موقّع من صاحب العمل"],
          ["2 passport-size photos", "صورتان شمسيتان"],
          ["Foreign employees: valid work permit and residence permit", "للأجراء الأجانب: إجازة عمل وإقامة ساريتا المفعول"]
        ]
      },
      {
        name: "Clearance certificate",
        ar: "براءة ذمة",
        docs: [
          ["Employer NSSF number", "رقم صاحب العمل في الضمان"],
          ["Latest salary declarations", "آخر تصاريح الرواتب"],
          ["Proof of payment of contributions", "إثبات دفع الاشتراكات"],
          ["ID of the authorised signatory", "هوية المفوّض بالتوقيع"]
        ]
      },
      {
        name: "End-of-service indemnity",
        ar: "تعويض نهاية الخدمة",
        docs: [
          ["NSSF card / number", "بطاقة / رقم الضمان"],
          ["ID card or individual civil extract", "بطاقة الهوية أو إخراج قيد فردي"],
          ["Resignation or termination letter", "كتاب الاستقالة أو الصرف"],
          ["Employer's leaving declaration", "تصريح ترك العمل من صاحب العمل"],
          ["Bank account details (IBAN)", "معلومات الحساب المصرفي (IBAN)"]
        ]
      }
    ]
  },
  {
    id: "realestate",
    title: "Real Estate Registration",
    ar: "تسجيل العقارات",
    color: "#b8865b",
    icon: "building",
    category: "property",
    goal: "Buy, sell or inherit a property",
    goalAr: "شراء أو بيع أو إرث عقار",
    authority: "General Directorate of Land Registry and Cadastre — Ministry of Finance",
    authorityAr: "المديرية العامة للشؤون العقارية — وزارة المالية",
    overview: "A property transaction only takes full effect once it is registered at the competent land registry office. We prepare and follow up sales and transfers, inheritance transfers, real-estate certificates and mortgage files.",
    overviewAr: "لا تكتمل المعاملة العقارية إلا بتسجيلها في أمانة السجل العقاري المختصة. نحضّر ونتابع معاملات البيع ونقل الملكية، وانتقال الإرث، والإفادات العقارية، وملفات الرهن.",
    blurb: "Property sales, transfers, inheritance, mortgages and land-registry certificates.",
    blurbAr: "بيع ونقل ملكية، انتقال إرث، رهون وإفادات من الدوائر العقارية.",
    subs: [
      {
        name: "Sale / transfer of ownership",
        ar: "بيع ونقل ملكية",
        docs: [
          ["Title deed or recent real-estate certificate", "سند التمليك أو إفادة عقارية حديثة"],
          ["IDs or individual civil extracts of seller and buyer", "هويات أو إخراجات قيد البائع والشاري"],
          ["Sale contract notarised by a notary public", "عقد بيع منظّم لدى الكاتب العدل"],
          ["Cadastral / survey map of the plot", "خريطة مساحة للعقار"],
          ["Municipality clearance", "براءة ذمة من البلدية"],
          ["Built-property tax clearance (Ministry of Finance)", "براءة ذمة من ضريبة الأملاك المبنية (وزارة المالية)"],
          ["Power of attorney, if a party is represented", "وكالة إذا كان أحد الأطراف ممثَّلاً"],
          ["Foreign buyers: proof of eligibility / required approvals", "للشارين الأجانب: إثبات الأهلية / الموافقات المطلوبة"]
        ]
      },
      {
        name: "Inheritance transfer",
        ar: "انتقال إرث",
        docs: [
          ["Death certificate", "وثيقة وفاة"],
          ["Inheritance decree from the competent court", "حصر إرث من المحكمة المختصة"],
          ["Inheritance tax clearance (Ministry of Finance)", "براءة ذمة من ضريبة الانتقال (وزارة المالية)"],
          ["IDs / civil extracts of all heirs", "هويات / إخراجات قيد جميع الورثة"],
          ["Real-estate certificates of the properties", "إفادات عقارية للعقارات"]
        ]
      },
      {
        name: "Real-estate certificate / search",
        ar: "إفادة عقارية",
        docs: [
          ["Property number and cadastral area", "رقم العقار والمنطقة العقارية"],
          ["ID of the requester", "هوية مقدّم الطلب"],
          ["Power of attorney if requested for someone else", "وكالة إذا كان الطلب لشخص آخر"]
        ]
      },
      {
        name: "Mortgage registration / release",
        ar: "تسجيل أو فك رهن",
        docs: [
          ["Real-estate certificate", "إفادة عقارية"],
          ["Mortgage contract or bank release letter", "عقد الرهن أو كتاب فك الرهن من المصرف"],
          ["IDs of the owner and creditor representative", "هويات المالك وممثل الدائن"]
        ]
      }
    ]
  },
  {
    id: "vehicles",
    title: "Vehicle Registration",
    ar: "تسجيل السيارات",
    color: "#b5544a",
    icon: "car",
    category: "property",
    goal: "Transfer, register or renew a car",
    goalAr: "نقل ملكية سيارة أو تسجيلها أو تجديدها",
    authority: "Traffic, Vehicles and Mechanics Management Authority (Nafaa)",
    authorityAr: "هيئة إدارة السير والآليات والمركبات (النافعة)",
    overview: "Car ownership transfers, first registrations, annual mechanic fees and plates are handled by the Traffic Management Organisation, known as the Nafaa. We prepare the papers, book the steps and follow up for you.",
    overviewAr: "تتولّى هيئة إدارة السير (النافعة) معاملات نقل ملكية السيارات، والتسجيل الأول، ورسوم الميكانيك السنوية، واللوحات. نحضّر الأوراق، ونحجز المواعيد، ونتابع عنك.",
    blurb: "Ownership transfers, new car registration, mechanic fees and plates at the Traffic Management Organisation (Nafaa).",
    blurbAr: "نقل ملكية، تسجيل سيارات جديدة، رسوم الميكانيك واللوحات لدى هيئة إدارة السير (النافعة).",
    subs: [
      {
        name: "Ownership transfer (used car)",
        ar: "نقل ملكية",
        docs: [
          ["Vehicle registration booklet", "رخصة السير (دفتر السيارة)"],
          ["Certified copy of ID or individual civil extract — seller", "صورة مصدّقة عن هوية أو إخراج قيد البائع"],
          ["Certified copy of ID or individual civil extract — buyer", "صورة مصدّقة عن هوية أو إخراج قيد الشاري"],
          ["Compulsory insurance (bodily injury) in the buyer's name", "تأمين إلزامي (أضرار جسدية) باسم الشاري"],
          ["Mechanical inspection report", "تقرير المعاينة الميكانيكية"],
          ["Power of attorney if a party cannot attend", "وكالة إذا تعذّر حضور أحد الأطراف"],
          ["Company-owned: Commercial Register certificate + signatory authorisation", "سيارة باسم شركة: إفادة سجل تجاري وتفويض بالتوقيع"]
        ]
      },
      {
        name: "New vehicle — first registration",
        ar: "تسجيل سيارة جديدة",
        docs: [
          ["Dealer invoice, or customs declaration for imported vehicles", "فاتورة الوكيل أو البيان الجمركي للسيارات المستوردة"],
          ["Certificate of origin / manufacturer documents", "شهادة المنشأ / مستندات الصانع"],
          ["Owner's ID or individual civil extract", "هوية المالك أو إخراج قيد فردي"],
          ["Compulsory insurance contract", "عقد التأمين الإلزامي"],
          ["Technical inspection certificate", "شهادة الكشف الفني"]
        ]
      },
      {
        name: "Mechanic fees (annual)",
        ar: "رسوم الميكانيك",
        docs: [
          ["Vehicle booklet (both sides)", "دفتر السيارة (الوجهان)"],
          ["Original compulsory insurance contract", "عقد التأمين الإلزامي الأصلي"],
          ["Compulsory insurance receipt", "إيصال التأمين الإلزامي"],
          ["Mechanical inspection certificate (when due)", "إفادة المعاينة الميكانيكية (عند استحقاقها)"]
        ]
      },
      {
        name: "Plates replacement / lost booklet",
        ar: "لوحات / بدل ضائع",
        docs: [
          ["Vehicle booklet (or police report if lost)", "دفتر السيارة (أو محضر من الدرك في حال الضياع)"],
          ["Valid ID, passport or individual civil extract (< 3 months)", "هوية أو جواز سفر أو إخراج قيد فردي (أقل من 3 أشهر)"]
        ]
      }
    ]
  },
  {
    id: "mofa",
    title: "Ministry of Foreign Affairs",
    ar: "وزارة الخارجية",
    color: "#9d8bbf",
    icon: "globe",
    category: "abroad",
    goal: "Use a document abroad",
    goalAr: "استعمال مستند في الخارج",
    authority: "Ministry of Foreign Affairs and Emigrants",
    authorityAr: "وزارة الخارجية والمغتربين",
    overview: "Lebanese documents used abroad usually go through a chain: the issuing authority, then the Ministry of Foreign Affairs, then the embassy of the destination country. Foreign documents follow the reverse path to be used in Lebanon. We manage each step and the sworn translations.",
    overviewAr: "تمرّ المستندات اللبنانية المعدّة للاستعمال في الخارج عادةً بسلسلة: الجهة المُصدِرة، ثم وزارة الخارجية، ثم سفارة البلد المعني. وتسلك المستندات الأجنبية المسار المعاكس لاستعمالها في لبنان. نتولّى كل خطوة والترجمات المحلّفة.",
    blurb: "Legalisation of Lebanese documents for use abroad, and foreign documents for use in Lebanon.",
    blurbAr: "تصديق المستندات اللبنانية لاستعمالها في الخارج والمستندات الأجنبية لاستعمالها في لبنان.",
    subs: [
      {
        name: "Legalise a Lebanese document for abroad",
        ar: "تصديق مستند للخارج",
        docs: [
          ["Original document, first stamped by the issuing Lebanese authority", "المستند الأصلي مصدّقاً أولاً من الجهة اللبنانية المُصدِرة"],
          ["Sworn translation, if the destination requires one", "ترجمة محلّفة إذا طلبتها الجهة المعنية"],
          ["Copy of your ID or passport", "صورة عن الهوية أو جواز السفر"],
          ["Power of attorney if we submit on your behalf", "وكالة إذا قدّمنا الطلب عنك"]
        ]
      },
      {
        name: "Legalise a sworn translation",
        ar: "تصديق ترجمة محلّفة",
        docs: [
          ["Original document", "المستند الأصلي"],
          ["Translation by a sworn translator", "ترجمة من مترجم محلّف"],
          ["Translator's signature certified by a notary, then the Ministry of Justice", "تصديق توقيع المترجم لدى الكاتب العدل ثم وزارة العدل"]
        ]
      },
      {
        name: "Foreign document for use in Lebanon",
        ar: "مستند أجنبي لاستعماله في لبنان",
        docs: [
          ["Original document legalised in its country of issue", "المستند الأصلي مصدّقاً في بلد الإصدار"],
          ["Legalisation by the Lebanese embassy / consulate there", "تصديق السفارة / القنصلية اللبنانية في ذلك البلد"],
          ["Arabic translation by a sworn translator, if required", "ترجمة محلّفة إلى العربية عند الحاجة"]
        ]
      }
    ]
  },
  {
    id: "insurance",
    title: "Insurance",
    ar: "التأمين",
    color: "#b8687a",
    icon: "umbrella",
    category: "personal",
    goal: "Insure my car, health or business",
    goalAr: "تأمين سيارتي أو صحتي أو عملي",
    authority: "Licensed insurance companies",
    authorityAr: "شركات التأمين المرخّصة",
    overview: "Compulsory insurance for bodily injury to third parties is required for every car on Lebanese roads. Beyond that, we help you arrange all-risk car cover, health, travel and business insurance with licensed insurers.",
    overviewAr: "التأمين الإلزامي ضد الأضرار الجسدية للغير مطلوب لكل سيارة تسير على الطرقات اللبنانية. وإلى جانبه، نساعدك في ترتيب التأمين الشامل للسيارة، والتأمين الصحي، وتأمين السفر والمؤسسات لدى شركات مرخّصة.",
    blurb: "Compulsory and all-risk car insurance, health, travel, life, property and workers' compensation.",
    blurbAr: "تأمين السيارات الإلزامي والشامل، الصحي، السفر، الحياة، الممتلكات وطوارئ العمل.",
    subs: [
      {
        name: "Car — compulsory / third party / all risk",
        ar: "تأمين سيارة — إلزامي / ضد الغير / شامل",
        docs: [
          ["Vehicle registration booklet", "دفتر السيارة"],
          ["Driver's licence", "رخصة القيادة"],
          ["Owner's ID", "هوية المالك"],
          ["Photos of the vehicle (all-risk only)", "صور السيارة (للتأمين الشامل فقط)"]
        ]
      },
      {
        name: "Health / medical",
        ar: "تأمين صحي",
        docs: [
          ["ID or passport of each insured person", "هوية أو جواز سفر كل شخص مؤمَّن"],
          ["Signed medical questionnaire", "استمارة طبية موقّعة"],
          ["NSSF number, if covered (complementary plans)", "رقم الضمان إن وُجد (للخطط المكمّلة)"]
        ]
      },
      {
        name: "Travel",
        ar: "تأمين سفر",
        docs: [
          ["Passport copy", "صورة جواز السفر"],
          ["Travel dates and destination", "تواريخ السفر والوجهة"],
          ["Visa requirement letter, if applicable", "كتاب متطلبات التأشيرة عند الحاجة"]
        ]
      },
      {
        name: "Business — fire, property, workers' compensation",
        ar: "تأمين مؤسسات — حريق، ممتلكات، طوارئ عمل",
        docs: [
          ["Commercial Register certificate", "إفادة سجل تجاري"],
          ["List of insured assets and values", "لائحة بالموجودات المؤمّنة وقيمها"],
          ["Number of employees and payroll", "عدد الأجراء والرواتب"],
          ["Photos / address of the premises", "صور وعنوان المؤسسة"]
        ]
      }
    ]
  },

  /* ---------- Additional services ---------- */
  {
    id: "tax",
    title: "Ministry of Finance & VAT",
    ar: "وزارة المالية والضريبة على القيمة المضافة",
    color: "#6aa39b",
    icon: "calc",
    category: "business",
    goal: "Get a tax number or register for VAT",
    goalAr: "الحصول على رقم مالي أو التسجيل في الـ TVA",
    authority: "Ministry of Finance",
    authorityAr: "وزارة المالية",
    overview: "Most businesses need a financial (tax) number, and some must register for VAT. We prepare the registrations, the periodic declarations and the tax clearance certificates other offices often ask for.",
    overviewAr: "تحتاج معظم المؤسسات إلى رقم مالي، ويتوجّب على بعضها التسجيل في الضريبة على القيمة المضافة. نحضّر طلبات التسجيل والتصاريح الدورية وبراءات الذمة الضريبية التي تطلبها دوائر أخرى غالباً.",
    blurb: "Financial number, VAT registration, tax declarations and tax clearance certificates.",
    blurbAr: "رقم مالي، تسجيل في الضريبة على القيمة المضافة، تصاريح ضريبية وبراءات ذمة.",
    subs: [
      {
        name: "Financial (tax) number",
        ar: "رقم مالي",
        docs: [
          ["ID or individual civil extract", "هوية أو إخراج قيد فردي"],
          ["Commercial Register certificate (if registered)", "إفادة سجل تجاري (إن وُجدت)"],
          ["Lease contract of the business address", "عقد إيجار مكان العمل"],
          ["Signed registration form", "استمارة تسجيل موقّعة"]
        ]
      },
      {
        name: "VAT registration",
        ar: "تسجيل في الـ TVA",
        docs: [
          ["Financial number certificate", "إفادة الرقم المالي"],
          ["Commercial Register certificate", "إفادة سجل تجاري"],
          ["Turnover / sales records", "سجلات رقم الأعمال / المبيعات"],
          ["ID of the authorised signatory", "هوية المفوّض بالتوقيع"]
        ]
      },
      {
        name: "Declarations & tax clearance",
        ar: "تصاريح وبراءة ذمة",
        docs: [
          ["Financial number", "الرقم المالي"],
          ["Financial statements / income records for the period", "البيانات المالية / سجلات المداخيل للفترة"],
          ["Payroll records (salary tax)", "سجلات الرواتب (ضريبة الرواتب والأجور)"]
        ]
      }
    ]
  },
  {
    id: "work",
    title: "Work Permits & Residency",
    ar: "إجازات العمل والإقامات",
    color: "#98a868",
    icon: "badge",
    category: "business",
    goal: "Hire a foreign employee",
    goalAr: "توظيف عامل أجنبي",
    authority: "Ministry of Labour & General Security",
    authorityAr: "وزارة العمل والمديرية العامة للأمن العام",
    overview: "Hiring a foreign employee involves a work permit from the Ministry of Labour and a residence permit from General Security. We prepare both files, including domestic worker files, and keep track of renewals.",
    overviewAr: "يتطلّب توظيف عامل أجنبي إجازة عمل من وزارة العمل وإقامة من الأمن العام. نحضّر الملفين، بما فيها ملفات العاملين في الخدمة المنزلية، ونتابع مواعيد التجديد.",
    blurb: "Ministry of Labour work permits and General Security residency for employees and domestic workers.",
    blurbAr: "إجازات عمل من وزارة العمل وإقامات من الأمن العام للموظفين والعاملين في الخدمة المنزلية.",
    subs: [
      {
        name: "Work permit (company employee)",
        ar: "إجازة عمل",
        docs: [
          ["Company Commercial Register certificate", "إفادة سجل تجاري للشركة"],
          ["Signed employment contract", "عقد عمل موقّع"],
          ["Valid passport copy", "صورة جواز سفر ساري"],
          ["CV and certified qualifications", "سيرة ذاتية وشهادات مصدّقة"],
          ["Police clearance", "شهادة حسن سلوك / سجل عدلي"],
          ["Medical certificate", "شهادة طبية"],
          ["Passport-size photos", "صور شمسية"]
        ]
      },
      {
        name: "Residence permit",
        ar: "إقامة",
        docs: [
          ["Approved work permit", "إجازة عمل موافَق عليها"],
          ["Valid passport", "جواز سفر ساري"],
          ["Employment contract", "عقد العمل"],
          ["Medical certificate", "شهادة طبية"],
          ["Proof of accommodation", "إثبات سكن"]
        ]
      },
      {
        name: "Domestic worker file",
        ar: "معاملة عاملة في الخدمة المنزلية",
        docs: [
          ["Employer's ID", "هوية صاحب العمل"],
          ["Worker's passport copy", "صورة جواز سفر العاملة"],
          ["Insurance policy for the worker", "بوليصة تأمين للعاملة"],
          ["Signed standard contract", "العقد الموحّد موقّعاً"]
        ]
      }
    ]
  },
  {
    id: "civil",
    title: "Civil Status",
    ar: "الأحوال الشخصية",
    color: "#d8b46a",
    icon: "family",
    category: "personal",
    goal: "Family records & civil extracts",
    goalAr: "قيود العائلة وإخراجات القيد",
    authority: "Directorate General of Personal Status — Ministry of Interior",
    authorityAr: "المديرية العامة للأحوال الشخصية — وزارة الداخلية",
    overview: "Civil extracts are asked for in almost every transaction. We obtain individual and family extracts and register marriages and births, including events that took place abroad.",
    overviewAr: "تُطلب إخراجات القيد في معظم المعاملات تقريباً. نستخرج إخراجات القيد الفردية والعائلية، ونسجّل الزيجات والولادات، بما فيها الحاصلة في الخارج.",
    blurb: "Civil extracts, birth and marriage registration, ID cards and passports.",
    blurbAr: "إخراجات قيد، تسجيل ولادات وزيجات، بطاقات هوية وجوازات سفر.",
    subs: [
      {
        name: "Individual / family civil extract",
        ar: "إخراج قيد فردي / عائلي",
        docs: [
          ["Full name, father's name, register number and place", "الاسم الكامل، اسم الأب، رقم السجل ومحلّه"],
          ["Copy of ID (if available)", "صورة عن الهوية (إن وُجدت)"]
        ]
      },
      {
        name: "Marriage registration",
        ar: "تسجيل زواج",
        docs: [
          ["Marriage contract from the religious or civil authority", "عقد الزواج من المرجع الديني أو المدني"],
          ["Individual civil extracts of both spouses", "إخراجات قيد فردية للزوجين"],
          ["Foreign marriage: contract legalised by the embassy and MoFA", "زواج في الخارج: عقد مصدّق من السفارة ووزارة الخارجية"]
        ]
      },
      {
        name: "Birth registration",
        ar: "تسجيل ولادة",
        docs: [
          ["Birth certificate from the hospital / doctor", "وثيقة ولادة من المستشفى / الطبيب"],
          ["Family civil extract of the parents", "إخراج قيد عائلي للوالدين"],
          ["Mukhtar certificate", "إفادة مختار"]
        ]
      }
    ]
  },
  {
    id: "trademark",
    title: "Trademark Registration",
    ar: "تسجيل العلامات التجارية",
    color: "#c47e4a",
    icon: "spark",
    category: "business",
    goal: "Protect my brand",
    goalAr: "حماية علامتي التجارية",
    authority: "Intellectual Property Protection Office — Ministry of Economy and Trade",
    authorityAr: "مصلحة حماية الملكية الفكرية — وزارة الاقتصاد والتجارة",
    overview: "Registering your name and logo protects them in Lebanon. We prepare new trademark applications, renewals and transfers of ownership.",
    overviewAr: "يحمي تسجيل اسمك وشعارك حقوقك في لبنان. نحضّر طلبات تسجيل العلامات الجديدة وتجديدها ونقل ملكيتها.",
    blurb: "Protect your brand name and logo at the Ministry of Economy's Intellectual Property Office.",
    blurbAr: "حماية اسمك التجاري وشعارك لدى مصلحة حماية الملكية الفكرية في وزارة الاقتصاد.",
    subs: [
      {
        name: "New trademark",
        ar: "علامة جديدة",
        docs: [
          ["Logo / mark in high resolution", "الشعار / العلامة بدقة عالية"],
          ["Owner's ID or company Commercial Register certificate", "هوية المالك أو إفادة السجل التجاري للشركة"],
          ["List of goods / services (classes)", "لائحة السلع / الخدمات (الفئات)"],
          ["Notarised power of attorney", "وكالة مصدّقة لدى الكاتب العدل"]
        ]
      },
      {
        name: "Renewal / transfer",
        ar: "تجديد / نقل ملكية",
        docs: [
          ["Existing registration certificate", "شهادة التسجيل الحالية"],
          ["Owner's ID or company documents", "هوية المالك أو مستندات الشركة"],
          ["Assignment deed (for transfers)", "عقد التنازل (لنقل الملكية)"]
        ]
      }
    ]
  },
  {
    id: "municipal",
    title: "Municipal Permits",
    ar: "معاملات البلدية",
    color: "#6f9e80",
    icon: "permit",
    category: "property",
    goal: "Lease or building permit",
    goalAr: "عقد إيجار أو رخصة بناء",
    authority: "Your local municipality",
    authorityAr: "البلدية المختصة",
    overview: "Many transactions start at the municipality: registering a lease, or obtaining building and occupancy permits. We prepare and follow up these files with the municipality concerned.",
    overviewAr: "تبدأ معاملات كثيرة من البلدية: تسجيل عقد إيجار، أو الاستحصال على رخص البناء والإسكان. نحضّر هذه الملفات ونتابعها مع البلدية المعنية.",
    blurb: "Lease registration, signboard permits, occupancy and building permits.",
    blurbAr: "تسجيل عقود الإيجار، رخص اللافتات، رخص البناء والإسكان.",
    subs: [
      {
        name: "Lease registration",
        ar: "تسجيل عقد إيجار",
        docs: [
          ["Signed lease contract", "عقد الإيجار موقّعاً"],
          ["IDs of landlord and tenant", "هويات المؤجر والمستأجر"],
          ["Real-estate certificate or title deed", "إفادة عقارية أو سند ملكية"]
        ]
      },
      {
        name: "Building / occupancy permit",
        ar: "رخصة بناء / إسكان",
        docs: [
          ["Title deed / real-estate certificate", "سند التمليك / إفادة عقارية"],
          ["Architectural plans signed by an engineer", "خرائط هندسية موقّعة من مهندس"],
          ["Cadastral map", "خريطة مساحة"],
          ["Order of Engineers approval", "موافقة نقابة المهندسين"]
        ]
      }
    ]
  },
  {
    id: "notary",
    title: "Notary & Translation",
    ar: "الكاتب العدل والترجمة",
    color: "#a497c0",
    icon: "pen",
    category: "personal",
    goal: "Power of attorney or translation",
    goalAr: "وكالة أو ترجمة",
    authority: "Notaries public & sworn translators",
    authorityAr: "الكتّاب العدل والمترجمون المحلّفون",
    overview: "Powers of attorney, sworn translations and certified copies are the building blocks of many other files. We arrange them so your main transaction is not held up.",
    overviewAr: "الوكالات والترجمات المحلّفة والنسخ المصدّقة هي أساس معاملات كثيرة. نرتّبها لك كي لا تتأخّر معاملتك الأساسية.",
    blurb: "Powers of attorney, sworn translations and certified copies.",
    blurbAr: "وكالات، ترجمات محلّفة ونسخ مصدّقة.",
    subs: [
      {
        name: "Power of attorney",
        ar: "وكالة",
        docs: [
          ["IDs of the grantor and the attorney", "هويات الموكِّل والوكيل"],
          ["Scope of the power (what it should cover)", "مضمون الوكالة (ما يجب أن تشمله)"],
          ["Related documents (car booklet, title deed, etc.)", "المستندات المتعلقة (دفتر سيارة، سند ملكية، إلخ)"]
        ]
      },
      {
        name: "Sworn translation",
        ar: "ترجمة محلّفة",
        docs: [
          ["Clear scan of the original document", "نسخة واضحة عن المستند الأصلي"],
          ["Target language", "اللغة المطلوبة"]
        ]
      }
    ]
  }
];

/* =====================================================================
   FRANÇAIS — titles, descriptions, transactions and document lists.
   Merged into SERVICES below (s.fr, s.blurbFr, s.goalFr, s.authorityFr,
   s.overviewFr, sub.fr, and each document becomes [en, ar, fr]).
   ===================================================================== */
window.SERVICES_FR = {
  commercial: {
    title: "Registre du commerce",
    blurb: "Immatriculation d'un commerçant, d'un établissement ou d'une société (SARL, SAL, Holding, Offshore) et modifications.",
    goal: "Créer ou immatriculer une entreprise",
    authority: "Registre du commerce — Ministère de la Justice (greffes régionaux)",
    overview: "Tout commerçant et toute société exerçant au Liban doivent être immatriculés au Registre du commerce, tenu par les greffes des tribunaux sous l'autorité du Ministère de la Justice. Nous préparons votre dossier, organisons les signatures et la légalisation notariale si nécessaire, le déposons et le suivons jusqu'à la délivrance de votre certificat d'immatriculation.",
    subs: [
      ["Immatriculation d'un commerçant", ["Carte d'identité libanaise ou extrait d'état civil individuel (moins de 3 mois)", "Casier judiciaire récent", "Bail enregistré à la municipalité, ou titre de propriété des locaux", "Demande d'immatriculation signée (formulaire du Registre du commerce)", "Spécimen de signature", "Certificat de numéro financier (fiscal), s'il est déjà délivré", "2 photos d'identité"]],
      ["Immatriculation d'un établissement", ["Carte d'identité ou extrait d'état civil individuel du propriétaire (< 3 mois)", "Casier judiciaire du propriétaire", "Justificatif de domiciliation : bail enregistré, titre de propriété ou permis d'occuper", "Nom commercial proposé + description de l'activité", "Demande d'immatriculation signée", "Certificat de numéro financier (fiscal), s'il existe", "Toute licence sectorielle exigée par l'activité (ex. Santé, Tourisme)"]],
      ["Immatriculation d'une société (SARL / SAL / Holding / Offshore)", ["Statuts signés et notariés", "Attestation bancaire de dépôt du capital social", "Pièces d'identité ou passeports de tous les associés / actionnaires", "Pièces d'identité et casiers judiciaires des gérants / administrateurs", "Justificatifs de domiciliation : titre de propriété, bail ou permis d'occuper", "Demande d'immatriculation (formulaire du Registre du commerce)", "Circulaire commerciale indiquant les signataires autorisés", "SAL / Holding / Offshore : acte de souscription + procès-verbal du premier conseil d'administration", "Actionnaires étrangers : documents légalisés et traduits en arabe"]],
      ["Modifications et certificats", ["Numéro au Registre du commerce du commerçant / de la société", "Décision du conseil ou des associés décrivant la modification", "Pièce d'identité du signataire autorisé", "Justificatifs (nouveau bail, acte de cession de parts, etc.)"]]
    ]
  },
  nssf: {
    title: "Sécurité sociale (CNSS)",
    blurb: "Affiliation des employeurs et des salariés, déclarations, quitus et dossiers d'indemnité de fin de service.",
    goal: "Déclarer des salariés à la sécurité sociale",
    authority: "Caisse nationale de sécurité sociale (CNSS)",
    overview: "Au Liban, les employeurs s'affilient à la Caisse nationale de sécurité sociale et y déclarent leurs salariés. Nous nous occupons de l'affiliation de l'employeur, des nouveaux salariés, des quitus et des dossiers de fin de service, pour que votre entreprise reste en règle.",
    subs: [
      ["Affiliation de l'employeur", ["Certificat du Registre du commerce", "Certificat de numéro financier (fiscal)", "Pièce d'identité du propriétaire / signataire autorisé", "Bail ou titre de propriété du lieu de travail", "Liste des salariés avec dates d'embauche et salaires", "Formulaire d'affiliation employeur de la CNSS signé"]],
      ["Affiliation d'un salarié", ["Extrait d'état civil individuel du salarié (< 3 mois)", "Copie de la carte d'identité du salarié", "Extrait d'état civil familial — pour ajouter conjoint / enfants", "Déclaration d'embauche signée par l'employeur", "2 photos d'identité", "Salariés étrangers : permis de travail et titre de séjour valides"]],
      ["Quitus (certificat de libération)", ["Numéro CNSS de l'employeur", "Dernières déclarations de salaires", "Preuve du paiement des cotisations", "Pièce d'identité du signataire autorisé"]],
      ["Indemnité de fin de service", ["Carte / numéro CNSS", "Carte d'identité ou extrait d'état civil individuel", "Lettre de démission ou de licenciement", "Déclaration de départ de l'employeur", "Coordonnées bancaires (IBAN)"]]
    ]
  },
  realestate: {
    title: "Enregistrement immobilier",
    blurb: "Ventes, transferts, successions, hypothèques et certificats du registre foncier.",
    goal: "Acheter, vendre ou hériter d'un bien",
    authority: "Direction générale des Affaires foncières et du Cadastre — Ministère des Finances",
    overview: "Une opération immobilière ne produit tous ses effets qu'une fois enregistrée au bureau foncier compétent. Nous préparons et suivons les ventes et transferts, les transferts successoraux, les certificats fonciers et les dossiers d'hypothèque.",
    subs: [
      ["Vente / transfert de propriété", ["Titre de propriété ou certificat foncier récent", "Pièces d'identité ou extraits d'état civil individuels du vendeur et de l'acheteur", "Contrat de vente notarié", "Plan cadastral / relevé de la parcelle", "Quitus de la municipalité", "Quitus de l'impôt sur la propriété bâtie (Ministère des Finances)", "Procuration, si une partie est représentée", "Acheteurs étrangers : justificatif d'éligibilité / autorisations requises"]],
      ["Transfert successoral", ["Acte de décès", "Jugement d'hérédité du tribunal compétent", "Quitus de l'impôt sur les successions (Ministère des Finances)", "Pièces d'identité / extraits d'état civil de tous les héritiers", "Certificats fonciers des biens"]],
      ["Certificat foncier / recherche", ["Numéro du bien et zone cadastrale", "Pièce d'identité du demandeur", "Procuration si la demande est faite pour un tiers"]],
      ["Inscription / mainlevée d'hypothèque", ["Certificat foncier", "Contrat d'hypothèque ou lettre de mainlevée de la banque", "Pièces d'identité du propriétaire et du représentant du créancier"]]
    ]
  },
  vehicles: {
    title: "Immatriculation des véhicules",
    blurb: "Transferts de propriété, première immatriculation, taxe mécanique et plaques auprès de la Nafaa.",
    goal: "Transférer, immatriculer ou renouveler une voiture",
    authority: "Autorité de gestion du trafic, des véhicules et de la mécanique (Nafaa)",
    overview: "Les transferts de propriété, les premières immatriculations, la taxe mécanique annuelle et les plaques relèvent de l'Autorité de gestion du trafic, appelée la Nafaa. Nous préparons les papiers, réservons les étapes et assurons le suivi pour vous.",
    subs: [
      ["Transfert de propriété (véhicule d'occasion)", ["Carte grise (carnet d'immatriculation)", "Copie certifiée de la pièce d'identité ou extrait d'état civil — vendeur", "Copie certifiée de la pièce d'identité ou extrait d'état civil — acheteur", "Assurance obligatoire (dommages corporels) au nom de l'acheteur", "Rapport de contrôle technique", "Procuration si une partie ne peut pas être présente", "Véhicule de société : certificat du Registre du commerce + autorisation du signataire"]],
      ["Véhicule neuf — première immatriculation", ["Facture du concessionnaire, ou déclaration en douane pour les véhicules importés", "Certificat d'origine / documents du constructeur", "Pièce d'identité ou extrait d'état civil individuel du propriétaire", "Contrat d'assurance obligatoire", "Certificat de contrôle technique"]],
      ["Taxe mécanique (annuelle)", ["Carte grise (recto et verso)", "Original du contrat d'assurance obligatoire", "Reçu de l'assurance obligatoire", "Certificat de contrôle technique (lorsqu'il est dû)"]],
      ["Remplacement de plaques / carte grise perdue", ["Carte grise (ou procès-verbal de police en cas de perte)", "Pièce d'identité valide, passeport ou extrait d'état civil individuel (< 3 mois)"]]
    ]
  },
  mofa: {
    title: "Ministère des Affaires étrangères",
    blurb: "Légalisation de documents libanais pour l'étranger, et de documents étrangers pour le Liban.",
    goal: "Utiliser un document à l'étranger",
    authority: "Ministère des Affaires étrangères et des Émigrés",
    overview: "Les documents libanais destinés à l'étranger suivent généralement une chaîne : l'autorité qui les a délivrés, puis le Ministère des Affaires étrangères, puis l'ambassade du pays de destination. Les documents étrangers suivent le chemin inverse pour être utilisés au Liban. Nous gérons chaque étape ainsi que les traductions assermentées.",
    subs: [
      ["Légaliser un document libanais pour l'étranger", ["Document original, d'abord tamponné par l'autorité libanaise qui l'a délivré", "Traduction assermentée, si le pays de destination l'exige", "Copie de votre pièce d'identité ou passeport", "Procuration si nous déposons en votre nom"]],
      ["Légaliser une traduction assermentée", ["Document original", "Traduction par un traducteur assermenté", "Signature du traducteur certifiée par un notaire, puis par le Ministère de la Justice"]],
      ["Document étranger pour usage au Liban", ["Document original légalisé dans son pays d'émission", "Légalisation par l'ambassade / le consulat du Liban sur place", "Traduction en arabe par un traducteur assermenté, si nécessaire"]]
    ]
  },
  insurance: {
    title: "Assurances",
    blurb: "Assurance auto obligatoire et tous risques, santé, voyage, vie, biens et accidents du travail.",
    goal: "Assurer ma voiture, ma santé ou mon entreprise",
    authority: "Compagnies d'assurance agréées",
    overview: "L'assurance obligatoire couvrant les dommages corporels causés aux tiers est exigée pour toute voiture circulant au Liban. Au-delà, nous vous aidons à souscrire une assurance auto tous risques, santé, voyage ou professionnelle auprès d'assureurs agréés.",
    subs: [
      ["Auto — obligatoire / tiers / tous risques", ["Carte grise", "Permis de conduire", "Pièce d'identité du propriétaire", "Photos du véhicule (tous risques uniquement)"]],
      ["Santé / médicale", ["Pièce d'identité ou passeport de chaque assuré", "Questionnaire médical signé", "Numéro CNSS, si assuré (contrats complémentaires)"]],
      ["Voyage", ["Copie du passeport", "Dates et destination du voyage", "Exigence du visa, le cas échéant"]],
      ["Entreprise — incendie, biens, accidents du travail", ["Certificat du Registre du commerce", "Liste des biens assurés et leurs valeurs", "Nombre de salariés et masse salariale", "Photos / adresse des locaux"]]
    ]
  },
  tax: {
    title: "Ministère des Finances et TVA",
    blurb: "Numéro financier, immatriculation à la TVA, déclarations fiscales et quitus fiscaux.",
    goal: "Obtenir un numéro fiscal ou s'immatriculer à la TVA",
    authority: "Ministère des Finances",
    overview: "La plupart des entreprises ont besoin d'un numéro financier (fiscal), et certaines doivent s'immatriculer à la TVA. Nous préparons les immatriculations, les déclarations périodiques et les quitus fiscaux souvent demandés par les autres administrations.",
    subs: [
      ["Numéro financier (fiscal)", ["Pièce d'identité ou extrait d'état civil individuel", "Certificat du Registre du commerce (si immatriculé)", "Bail de l'adresse de l'activité", "Formulaire d'immatriculation signé"]],
      ["Immatriculation à la TVA", ["Certificat de numéro financier", "Certificat du Registre du commerce", "Chiffre d'affaires / registres des ventes", "Pièce d'identité du signataire autorisé"]],
      ["Déclarations et quitus fiscal", ["Numéro financier", "États financiers / relevés de revenus de la période", "Registres de paie (impôt sur les salaires)"]]
    ]
  },
  work: {
    title: "Permis de travail et séjour",
    blurb: "Permis de travail du Ministère du Travail et titres de séjour de la Sûreté générale, salariés et employés de maison.",
    goal: "Embaucher un salarié étranger",
    authority: "Ministère du Travail et Sûreté générale",
    overview: "Embaucher un salarié étranger suppose un permis de travail du Ministère du Travail et un titre de séjour de la Sûreté générale. Nous préparons les deux dossiers, y compris pour les employés de maison, et suivons les renouvellements.",
    subs: [
      ["Permis de travail (salarié d'entreprise)", ["Certificat du Registre du commerce de la société", "Contrat de travail signé", "Copie du passeport en cours de validité", "CV et diplômes certifiés", "Certificat de bonne conduite (casier)", "Certificat médical", "Photos d'identité"]],
      ["Titre de séjour", ["Permis de travail approuvé", "Passeport en cours de validité", "Contrat de travail", "Certificat médical", "Justificatif de logement"]],
      ["Dossier d'employé(e) de maison", ["Pièce d'identité de l'employeur", "Copie du passeport de l'employé(e)", "Police d'assurance de l'employé(e)", "Contrat type signé"]]
    ]
  },
  civil: {
    title: "État civil",
    blurb: "Extraits d'état civil, enregistrement des naissances et mariages, cartes d'identité et passeports.",
    goal: "Actes familiaux et extraits d'état civil",
    authority: "Direction générale du Statut personnel — Ministère de l'Intérieur",
    overview: "Les extraits d'état civil sont demandés dans presque toutes les démarches. Nous obtenons les extraits individuels et familiaux et enregistrons les mariages et les naissances, y compris ceux survenus à l'étranger.",
    subs: [
      ["Extrait d'état civil individuel / familial", ["Nom complet, nom du père, numéro et lieu du registre", "Copie de la pièce d'identité (si disponible)"]],
      ["Enregistrement d'un mariage", ["Contrat de mariage de l'autorité religieuse ou civile", "Extraits d'état civil individuels des deux époux", "Mariage à l'étranger : contrat légalisé par l'ambassade et le Ministère des Affaires étrangères"]],
      ["Enregistrement d'une naissance", ["Certificat de naissance de l'hôpital / du médecin", "Extrait d'état civil familial des parents", "Certificat du moukhtar"]]
    ]
  },
  trademark: {
    title: "Dépôt de marque",
    blurb: "Protégez votre nom et votre logo auprès de l'Office de la propriété intellectuelle du Ministère de l'Économie.",
    goal: "Protéger ma marque",
    authority: "Office de protection de la propriété intellectuelle — Ministère de l'Économie et du Commerce",
    overview: "Enregistrer votre nom et votre logo les protège au Liban. Nous préparons les nouveaux dépôts de marque, les renouvellements et les transferts de propriété.",
    subs: [
      ["Nouvelle marque", ["Logo / marque en haute résolution", "Pièce d'identité du titulaire ou certificat du Registre du commerce de la société", "Liste des produits / services (classes)", "Procuration notariée"]],
      ["Renouvellement / cession", ["Certificat d'enregistrement existant", "Pièce d'identité du titulaire ou documents de la société", "Acte de cession (pour les transferts)"]]
    ]
  },
  municipal: {
    title: "Permis municipaux",
    blurb: "Enregistrement des baux, permis d'enseigne, permis d'occuper et de construire.",
    goal: "Bail ou permis de construire",
    authority: "Votre municipalité",
    overview: "Beaucoup de démarches commencent à la municipalité : enregistrer un bail, ou obtenir un permis de construire et un permis d'occuper. Nous préparons et suivons ces dossiers auprès de la municipalité concernée.",
    subs: [
      ["Enregistrement d'un bail", ["Contrat de bail signé", "Pièces d'identité du bailleur et du locataire", "Certificat foncier ou titre de propriété"]],
      ["Permis de construire / d'occuper", ["Titre de propriété / certificat foncier", "Plans d'architecte signés par un ingénieur", "Plan cadastral", "Visa de l'Ordre des ingénieurs"]]
    ]
  },
  notary: {
    title: "Notaire et traduction",
    blurb: "Procurations, traductions assermentées et copies certifiées.",
    goal: "Procuration ou traduction",
    authority: "Notaires et traducteurs assermentés",
    overview: "Procurations, traductions assermentées et copies certifiées sont la base de nombreux autres dossiers. Nous les organisons pour que votre démarche principale ne soit pas retardée.",
    subs: [
      ["Procuration", ["Pièces d'identité du mandant et du mandataire", "Étendue de la procuration (ce qu'elle doit couvrir)", "Documents liés (carte grise, titre de propriété, etc.)"]],
      ["Traduction assermentée", ["Scan lisible du document original", "Langue cible"]]
    ]
  }
};
(function mergeFrench() {
  const F = window.SERVICES_FR || {};
  (window.SERVICES || []).forEach(s => {
    const f = F[s.id]; if (!f) return;
    s.fr = f.title; s.blurbFr = f.blurb; s.goalFr = f.goal; s.authorityFr = f.authority; s.overviewFr = f.overview;
    s.subs.forEach((u, i) => {
      const fu = f.subs[i]; if (!fu) return;
      u.fr = fu[0];
      u.docs = u.docs.map((d, j) => { const a = Array.isArray(d) ? d.slice(0, 2) : [d, d]; a[2] = fu[1][j] || a[0]; return a; });
    });
  });
  const S = window.SITE;
  if (S) { S.addressFr = S.addressFr || "Baabda, Mont-Liban"; S.hoursFr = S.hoursFr || "Lun–ven 8h30–17h00 · sam 9h00–13h00"; }
})();
