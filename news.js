/* =====================================================================
   NEWS & GUIDES (English / Arabic)
   Add a new item at the TOP of the list. Easier: add a row in the
   "News" tab of your Google tracking sheet — those appear automatically.
   category: "news" | "guide" | "announcement"
   service:  a service id from data.js (optional, links the article to it)
   body:     one string per paragraph
   ===================================================================== */
window.NEWS = [
  {
    id: "website-launch",
    date: "2026-10-28",
    category: "announcement",
    service: "",
    title: "Al Marjaa is now online: open and track your file from anywhere",
    titleAr: "المرجع أصبح أونلاين: افتح ملفك وتابعه من أي مكان",
    summary: "Create an account, upload your documents for any of our 12 services and follow every step of your file from your phone.",
    summaryAr: "أنشئ حساباً، ارفع مستنداتك لأيّ من خدماتنا الـ12، وتابع كل خطوة في ملفك من تلفونك.",
    body: [
      "Our new website lets you start a file without visiting the office. Choose the service and the transaction, see the exact list of documents usually required, and upload scans or phone photos of each one.",
      "Once your file is sent, it appears in My files with a file number and a status: Received, Under review, In progress, Ready for pickup, Completed. If something is missing, we mark it clearly and you can add the document straight from your phone.",
      "The whole site works in Arabic and English, in light or dark mode. Questions? We're one WhatsApp message away."
    ],
    bodyAr: [
      "يتيح لك موقعنا الجديد فتح ملف من دون زيارة المكتب. اختر الخدمة والمعاملة، اطّلع على لائحة المستندات المطلوبة عادةً، وارفع صوراً أو نسخاً ممسوحة لكل منها.",
      "بعد إرسال ملفك، يظهر في «ملفاتي» مع رقم ملف وحالة: تم الاستلام، قيد المراجعة، قيد التنفيذ، جاهز للاستلام، مُنجز. وإذا نقص أي مستند، نحدّده بوضوح ويمكنك إضافته مباشرة من تلفونك.",
      "يعمل الموقع بالكامل بالعربية والإنكليزية، بالوضع الفاتح أو الداكن. عندك سؤال؟ رسالة واتساب وحدة ومنجاوبك."
    ],
    source: null
  },
  {
    id: "nafaa-booklets-plates-oct-2026",
    date: "2026-10-21",
    category: "news",
    service: "vehicles",
    title: "Nafaa: driving licences, car booklets and plates on hold during a supplier changeover",
    titleAr: "النافعة: توقّف إصدار دفاتر السوق ودفاتر تسجيل السيارات وتسليم اللوحات خلال انتقال الأعمال إلى شركة جديدة",
    summary: "Local media report that the issuing of driving licences and vehicle registration booklets, and the delivery of plates, has stopped while production moves to a new company.",
    summaryAr: "أفادت وسائل إعلام محلية بتوقّف إصدار دفاتر السوق ودفاتر تسجيل السيارات وتسليم اللوحات خلال انتقال الإنتاج إلى شركة جديدة.",
    body: [
      "According to reports published in mid and late October 2026, the Traffic, Vehicles and Mechanics Management Authority (Nafaa) has stopped issuing driving licences and vehicle registration booklets, and delivering plates. The company that produced them reportedly stopped work before the handover to a new company, which needs time to prepare production.",
      "Reports mention concerns among buyers and car showrooms about relying on temporary receipts as proof of a transaction until the new documents are issued. No official date for resuming the service had been announced at the time of the reports.",
      "What this means for you: if you are buying or selling a car, keep every receipt and document from the transaction safely. If you have a file with us, we will follow up and tell you as soon as booklets and plates are being delivered again."
    ],
    bodyAr: [
      "بحسب تقارير نُشرت في منتصف وأواخر تشرين الأول 2026، توقّفت هيئة إدارة السير والآليات والمركبات (النافعة) عن إصدار دفاتر السوق ودفاتر تسجيل السيارات وتسليم اللوحات. ووفق المعلومات المتداولة، توقّفت الشركة التي كانت تتولّى التصنيع قبل استكمال التسليم إلى الشركة الجديدة التي تحتاج إلى مهلة لتجهيز الإنتاج.",
      "وتشير التقارير إلى مخاوف لدى المشترين ومعارض السيارات من الاعتماد على إيصالات مؤقتة لإثبات المعاملات إلى حين صدور المستندات الجديدة. ولم يُعلن عن موعد رسمي لاستئناف الخدمة حتى تاريخ نشر التقارير.",
      "ماذا يعني ذلك لك: إذا كنت تشتري سيارة أو تبيعها، احتفظ بكل إيصال ومستند يتعلّق بالمعاملة. وإذا كان لديك ملف معنا، سنتابع ونبلغك فور استئناف تسليم الدفاتر واللوحات."
    ],
    source: { name: "Beirut 24", url: "https://www.beirut24.org/2026/10/21/%D8%B3%D9%8A%D9%91%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A8%D9%84%D8%A7-%D8%AF%D9%81%D8%A7%D8%AA%D8%B1-%D8%AA%D8%B3%D8%AC%D9%8A%D9%84-%D8%A3%D8%B2%D9%85%D8%A9-%D8%A7%D9%84%D9%86%D8%A7%D9%81%D8%B9%D8%A9/" }
  },
  {
    id: "guide-selling-a-car",
    date: "2026-10-20",
    category: "guide",
    service: "vehicles",
    title: "Selling or buying a used car? What to prepare for the ownership transfer",
    titleAr: "تبيع أو تشتري سيارة مستعملة؟ ما تحضّره لنقل الملكية",
    summary: "The vehicle booklet, both parties' IDs, compulsory insurance in the buyer's name and a mechanical inspection: here is the usual list.",
    summaryAr: "دفتر السيارة، هويات الطرفين، التأمين الإلزامي باسم الشاري والمعاينة الميكانيكية: إليك اللائحة المعتادة.",
    body: [
      "An ownership transfer is done at the Nafaa and usually needs both parties, or a power of attorney for whoever cannot attend. Before you go, make sure you have the vehicle registration booklet and a certified copy of the ID or individual civil extract of both the seller and the buyer.",
      "The buyer will also need compulsory insurance in their name, and the car may need a mechanical inspection. If the car belongs to a company, add the company's Commercial Register certificate and the authorisation of the person signing.",
      "Requirements can change between centres and over time, so we always confirm the exact list when we review your file. You can upload everything from the vehicle service page."
    ],
    bodyAr: [
      "تتم معاملة نقل الملكية في النافعة وتتطلّب عادةً حضور الطرفين، أو وكالة لمن يتعذّر حضوره. قبل التوجّه، تأكّد من وجود رخصة السير (دفتر السيارة) وصورة مصدّقة عن هوية أو إخراج قيد فردي لكل من البائع والشاري.",
      "يحتاج الشاري أيضاً إلى تأمين إلزامي باسمه، وقد تحتاج السيارة إلى معاينة ميكانيكية. وإذا كانت السيارة باسم شركة، أضف إفادة السجل التجاري للشركة وتفويض الشخص المخوّل بالتوقيع.",
      "قد تختلف المتطلبات بين المراكز ومع الوقت، لذلك نؤكد دائماً اللائحة النهائية عند مراجعة ملفك. يمكنك رفع كل المستندات من صفحة خدمة السيارات."
    ],
    source: null
  },
  {
    id: "guide-legalisation-abroad",
    date: "2026-10-14",
    category: "guide",
    service: "mofa",
    title: "Using a Lebanese document abroad: the usual legalisation path",
    titleAr: "استعمال مستند لبناني في الخارج: مسار التصديق المعتاد",
    summary: "Issuing authority, then the Ministry of Foreign Affairs, then the embassy of the destination country, with a sworn translation where required.",
    summaryAr: "الجهة المُصدِرة، ثم وزارة الخارجية، ثم سفارة البلد المعني، مع ترجمة محلّفة عند الحاجة.",
    body: [
      "Lebanon is not a party to the Hague Apostille Convention, so documents travelling abroad usually go through a chain of legalisations. First, the original is stamped by the Lebanese authority that issued it. Then it is legalised by the Ministry of Foreign Affairs and Emigrants.",
      "Many destination countries then ask for a sworn translation and a final legalisation by their own embassy or consulate in Beirut. Each embassy sets its own rules on languages, translators and how recent the legalisation must be.",
      "Tell us which country the document is for, and we will confirm the exact steps before we start."
    ],
    bodyAr: [
      "لبنان ليس طرفاً في اتفاقية لاهاي للأبوستيل، لذا تمرّ المستندات المعدّة للخارج عادةً بسلسلة تصديقات. أولاً، يُصدَّق المستند الأصلي من الجهة اللبنانية التي أصدرته، ثم من وزارة الخارجية والمغتربين.",
      "وتطلب دول كثيرة بعد ذلك ترجمة محلّفة وتصديقاً نهائياً من سفارتها أو قنصليتها في بيروت. ولكل سفارة شروطها الخاصة باللغات والمترجمين ومدى حداثة التصديق.",
      "أخبرنا لأيّ بلد هو المستند، ونؤكد لك الخطوات الدقيقة قبل البدء."
    ],
    source: { name: "Embassy of Italy in Beirut — legalisation", url: "https://ambbeirut.esteri.it/en/?p=202" }
  },
  {
    id: "guide-starting-a-business",
    date: "2026-10-07",
    category: "guide",
    service: "commercial",
    title: "Starting a business in Lebanon: the registrations most companies go through",
    titleAr: "تأسيس عمل تجاري في لبنان: التسجيلات التي تمرّ بها معظم الشركات",
    summary: "Commercial Register, financial number, NSSF employer registration and any sector licence your activity needs.",
    summaryAr: "السجل التجاري، الرقم المالي، التسجيل كصاحب عمل في الضمان، وأي ترخيص قطاعي يتطلّبه نشاطك.",
    body: [
      "Most new businesses start with the Commercial Register: as a trader, an establishment, or a company such as a SARL or SAL. Companies need notarised articles of association and a bank certificate showing the share capital was deposited.",
      "Next comes the financial (tax) number at the Ministry of Finance, and employer registration with the National Social Security Fund before hiring. Depending on your activity, you may also need a licence from a specific ministry or the municipality.",
      "Every activity is different. We map out your exact path in the first review, then handle each registration in order."
    ],
    bodyAr: [
      "تبدأ معظم المشاريع الجديدة من السجل التجاري: كتاجر، أو مؤسسة، أو شركة مثل ش.م.م أو ش.م.ل. وتحتاج الشركات إلى نظام أساسي مصدّق وإفادة مصرفية بإيداع رأس المال.",
      "ثم يأتي الرقم المالي لدى وزارة المالية، والتسجيل كصاحب عمل في الصندوق الوطني للضمان الاجتماعي قبل التوظيف. وبحسب نشاطك، قد تحتاج أيضاً إلى ترخيص من وزارة معيّنة أو من البلدية.",
      "لكل نشاط خصوصيته. نرسم لك مسارك الدقيق في المراجعة الأولى، ثم نتولّى كل تسجيل بالترتيب."
    ],
    source: null
  },
  {
    id: "guide-civil-extract-date",
    date: "2026-09-30",
    category: "guide",
    service: "civil",
    title: "Why the date on your civil extract matters",
    titleAr: "لماذا يهمّ تاريخ إخراج القيد",
    summary: "Many offices ask for an individual civil extract issued within the last three months. An older one can send your file back.",
    summaryAr: "تطلب دوائر كثيرة إخراج قيد فردي لا يتجاوز تاريخه ثلاثة أشهر، والقديم ممكن يرجّع ملفك.",
    body: [
      "The individual civil extract (إخراج قيد فردي) is one of the most requested papers in Lebanese transactions: company registration, social security, vehicles and more.",
      "Many offices accept it only if it was issued recently, often within the last three months. Before sending your file, check the date on yours. If it is older, we can obtain a new one for you as part of the file."
    ],
    bodyAr: [
      "إخراج القيد الفردي من أكثر المستندات المطلوبة في المعاملات اللبنانية: تسجيل الشركات، والضمان الاجتماعي، والسيارات وغيرها.",
      "وتقبله دوائر كثيرة فقط إذا كان حديث الإصدار، غالباً خلال الأشهر الثلاثة الأخيرة. قبل إرسال ملفك، تحقّق من تاريخه. وإذا كان أقدم، يمكننا استخراج إخراج قيد جديد لك ضمن الملف."
    ],
    source: null
  },
  {
    id: "nssf-contributions-deadline-2026",
    date: "2026-04-14",
    category: "news",
    service: "nssf",
    title: "NSSF postponed contribution deadlines to 30 June 2026",
    titleAr: "الضمان الاجتماعي أجّل استحقاق الاشتراكات حتى 30 حزيران 2026",
    summary: "Monthly contributions for February–April 2026 and quarterly contributions for Q4 2025 and Q1 2026 could be paid until 30 June 2026; late increases apply from 1 July 2026.",
    summaryAr: "أُتيح تسديد الاشتراكات الشهرية عن شباط حتى نيسان 2026 والفصلية عن الفصل الرابع 2025 والأول 2026 حتى 30 حزيران 2026، على أن تسري زيادات التأخير اعتباراً من 1 تموز 2026.",
    body: [
      "In a memorandum dated 8 April 2026 and announced on 14 April, the Director General of the National Social Security Fund postponed the due date of employers' monthly contributions for February, March and April 2026, and of quarterly and special-category contributions for the fourth quarter of 2025 and the first quarter of 2026, to 30 June 2026.",
      "Late-payment increases apply to contributions still unpaid from 1 July 2026. If your company has outstanding contributions or needs a clearance certificate, we can check your position and prepare the file."
    ],
    bodyAr: [
      "بموجب مذكرة مؤرخة في 8 نيسان 2026 وأُعلن عنها في 14 نيسان، أجّل المدير العام للصندوق الوطني للضمان الاجتماعي استحقاق الاشتراكات الشهرية للمؤسسات عن أشهر شباط وآذار ونيسان 2026، والاشتراكات الفصلية والفئات الخاصة عن الفصل الرابع من 2025 والفصل الأول من 2026، حتى 30 حزيران 2026.",
      "وتسري زيادات التأخير على الاشتراكات غير المسدّدة اعتباراً من 1 تموز 2026. إذا كان على مؤسستك اشتراكات متأخرة أو تحتاج إلى براءة ذمة، يمكننا التحقق من وضعك وتحضير الملف."
    ],
    source: { name: "NSSF — cnss.gov.lb", url: "https://www.cnss.gov.lb/33-%D9%83%D8%B1%D9%83%D9%8A-%D8%AA%D8%A3%D8%AC%D9%8A%D9%84-%D8%A7%D8%B3%D8%AA%D8%AD%D9%82%D8%A7%D9%82-%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%D8%A7%D8%AA-%D8%A7%D9%84%D8%B6%D9%85%D8%A7%D9%86-%D8%A7/" }
  }
];

/* ---------------- Français ---------------- */
(function () {
  const FR = {
    "website-launch": ["Al Marjaa est en ligne : ouvrez et suivez votre dossier où que vous soyez",
      "Créez un compte, envoyez vos documents pour l'un de nos 12 services et suivez chaque étape de votre dossier depuis votre téléphone.",
      ["Notre nouveau site vous permet d'ouvrir un dossier sans passer au bureau. Choisissez le service et la démarche, consultez la liste exacte des documents habituellement demandés, et envoyez des scans ou des photos de chacun.",
       "Une fois envoyé, votre dossier apparaît dans Mes dossiers avec un numéro et un statut : Reçu, En cours d'examen, En traitement, Prêt à retirer, Terminé. S'il manque quelque chose, nous l'indiquons clairement et vous pouvez ajouter le document directement depuis votre téléphone.",
       "Tout le site fonctionne en arabe, en français et en anglais, en mode clair ou sombre. Une question ? Un simple message WhatsApp suffit."]],
    "nafaa-booklets-plates-oct-2026": ["Nafaa : permis de conduire, cartes grises et plaques suspendus pendant un changement de fournisseur",
      "Des médias locaux rapportent que la délivrance des permis de conduire et des cartes grises, ainsi que la remise des plaques, est à l'arrêt le temps que la production passe à une nouvelle société.",
      ["Selon des articles parus mi et fin octobre 2026, l'Autorité de gestion du trafic, des véhicules et de la mécanique (Nafaa) a cessé de délivrer les permis de conduire et les cartes grises, et de remettre les plaques. La société qui les produisait aurait arrêté le travail avant la passation à une nouvelle société, qui a besoin de temps pour préparer la production.",
       "Les articles évoquent l'inquiétude des acheteurs et des concessionnaires, contraints de se fier à des reçus provisoires comme preuve d'une transaction en attendant les nouveaux documents. Aucune date officielle de reprise n'avait été annoncée au moment de ces articles.",
       "Ce que cela signifie pour vous : si vous achetez ou vendez une voiture, conservez soigneusement chaque reçu et document de la transaction. Si vous avez un dossier chez nous, nous assurons le suivi et vous prévenons dès que les cartes grises et les plaques sont de nouveau délivrées."]],
    "guide-selling-a-car": ["Vendre ou acheter une voiture d'occasion ? Ce qu'il faut préparer pour le transfert",
      "La carte grise, les pièces d'identité des deux parties, l'assurance obligatoire au nom de l'acheteur et un contrôle technique : voici la liste habituelle.",
      ["Le transfert de propriété se fait à la Nafaa et nécessite en général la présence des deux parties, ou une procuration pour celle qui ne peut pas venir. Avant d'y aller, assurez-vous d'avoir la carte grise et une copie certifiée de la pièce d'identité ou de l'extrait d'état civil individuel du vendeur comme de l'acheteur.",
       "L'acheteur aura aussi besoin d'une assurance obligatoire à son nom, et la voiture peut devoir passer un contrôle technique. Si la voiture appartient à une société, ajoutez le certificat du Registre du commerce et l'autorisation de la personne qui signe.",
       "Les exigences peuvent varier selon les centres et dans le temps ; nous confirmons donc toujours la liste exacte à l'examen de votre dossier. Vous pouvez tout envoyer depuis la page du service véhicules."]],
    "guide-legalisation-abroad": ["Utiliser un document libanais à l'étranger : le parcours de légalisation habituel",
      "L'autorité qui l'a délivré, puis le Ministère des Affaires étrangères, puis l'ambassade du pays de destination, avec une traduction assermentée si nécessaire.",
      ["Le Liban n'est pas partie à la Convention de La Haye sur l'apostille ; les documents destinés à l'étranger passent donc en général par une chaîne de légalisations. D'abord, l'original est tamponné par l'autorité libanaise qui l'a délivré. Il est ensuite légalisé par le Ministère des Affaires étrangères et des Émigrés.",
       "De nombreux pays demandent ensuite une traduction assermentée et une dernière légalisation par leur propre ambassade ou consulat à Beyrouth. Chaque ambassade fixe ses propres règles sur les langues, les traducteurs et l'ancienneté acceptée de la légalisation.",
       "Dites-nous à quel pays le document est destiné, et nous confirmerons les étapes exactes avant de commencer."]],
    "guide-starting-a-business": ["Créer une entreprise au Liban : les immatriculations par lesquelles passent la plupart des sociétés",
      "Registre du commerce, numéro financier, affiliation employeur à la CNSS et toute licence sectorielle exigée par votre activité.",
      ["La plupart des nouvelles entreprises commencent par le Registre du commerce : en tant que commerçant, établissement, ou société comme une SARL ou une SAL. Les sociétés ont besoin de statuts notariés et d'une attestation bancaire de dépôt du capital social.",
       "Viennent ensuite le numéro financier (fiscal) au Ministère des Finances, puis l'affiliation employeur à la Caisse nationale de sécurité sociale avant toute embauche. Selon votre activité, il peut aussi falloir une licence d'un ministère précis ou de la municipalité.",
       "Chaque activité est différente. Nous traçons votre parcours exact lors du premier examen, puis traitons chaque immatriculation dans l'ordre."]],
    "guide-civil-extract-date": ["Pourquoi la date de votre extrait d'état civil compte",
      "De nombreuses administrations exigent un extrait d'état civil individuel de moins de trois mois. Un extrait plus ancien peut faire revenir votre dossier.",
      ["L'extrait d'état civil individuel (إخراج قيد فردي) est l'un des papiers les plus demandés dans les démarches libanaises : immatriculation d'une société, sécurité sociale, véhicules et bien d'autres.",
       "Beaucoup d'administrations ne l'acceptent que s'il est récent, souvent de moins de trois mois. Avant d'envoyer votre dossier, vérifiez la date du vôtre. S'il est plus ancien, nous pouvons en obtenir un nouveau dans le cadre du dossier."]],
    "nssf-contributions-deadline-2026": ["La CNSS a reporté au 30 juin 2026 l'échéance des cotisations",
      "Les cotisations mensuelles de février à avril 2026 et trimestrielles du 4e trimestre 2025 et du 1er trimestre 2026 pouvaient être payées jusqu'au 30 juin 2026 ; les majorations de retard s'appliquent à partir du 1er juillet 2026.",
      ["Par une note datée du 8 avril 2026 et annoncée le 14 avril, le directeur général de la Caisse nationale de sécurité sociale a reporté au 30 juin 2026 l'échéance des cotisations mensuelles des employeurs pour février, mars et avril 2026, ainsi que des cotisations trimestrielles et des catégories spéciales pour le quatrième trimestre 2025 et le premier trimestre 2026.",
       "Des majorations de retard s'appliquent aux cotisations encore impayées à partir du 1er juillet 2026. Si votre entreprise a des cotisations en suspens ou a besoin d'un quitus, nous pouvons vérifier votre situation et préparer le dossier."]]
  };
  (window.NEWS || []).forEach(n => {
    const f = FR[n.id]; if (!f) return;
    n.titleFr = f[0]; n.summaryFr = f[1]; n.bodyFr = f[2];
    if (n.id === "website-launch") {
      n.body = n.body.map(p => p.replace("works in Arabic and English", "works in Arabic, French and English"));
      n.bodyAr = (n.bodyAr || []).map(p => p.replace("بالعربية والإنكليزية", "بالعربية والفرنسية والإنكليزية"));
    }
  });
})();
