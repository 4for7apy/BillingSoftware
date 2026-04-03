const STORAGE_KEY = "vishal-special-invoice-maker-v6";
const ACCESS_PASSWORD = "arpit";
const ACCESS_SESSION_KEY = "vishal-special-access";
const CLOUD_SAVE_API_PATH = "/api/save-invoice";
const DEFAULT_BANK_DETAILS = {
  bankHolder: "Urmila Enterprises",
  bankName: "State Bank of India",
  bankAccountNo: "43639308704",
  bankBranchIfsc: "Rajendra Nagar (Gorakhpur) & SBIN0018455",
};

function formatCurrentDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
    .format(new Date())
    .replace(/ /g, "-");
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultInvoiceNumber() {
  return "INV-001";
}

function getFinancialYearLabel(dateText = formatCurrentDate()) {
  const parsed = parseInvoiceDate(dateText) || new Date();
  const year = parsed.getFullYear();
  const month = parsed.getMonth();
  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;
  return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
}

function parseInvoiceDate(dateText) {
  if (!dateText) {
    return null;
  }
  const match = String(dateText).trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/);
  if (!match) {
    return null;
  }
  const months = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  const day = Number(match[1]);
  const month = months[match[2].toLowerCase()];
  let year = Number(match[3]);
  if (Number.isNaN(day) || month === undefined || Number.isNaN(year)) {
    return null;
  }
  if (year < 100) {
    year += 2000;
  }
  return new Date(year, month, day);
}

function formatInvoiceNumber(dateText, series, sequence) {
  const fy = getFinancialYearLabel(dateText);
  const cleanSeries = (series || "UE").trim().toUpperCase();
  const paddedSequence = String(Math.max(1, Number(sequence) || 1)).padStart(3, "0");
  return `${fy}/${cleanSeries}${paddedSequence}`;
}

function blankItem() {
  return {
    productId: "",
    description: "",
    hsn: "",
    quantity: 1,
    rate: 0,
    unit: "NOS",
    taxRate: 0,
    costRate: 0,
  };
}

function blankPurchaseItem() {
  return {
    productId: "",
    description: "",
    quantity: 1,
    rate: 0,
    unit: "NOS",
  };
}

function defaultPurchaseBill() {
  return {
    id: createId("purchase"),
    supplierName: "",
    supplierContact: "",
    supplierAddress: "",
    purchaseDate: formatCurrentDate(),
    purchaseBillNo: `PB-${Date.now().toString().slice(-6)}`,
    notes: "",
    items: [blankPurchaseItem()],
    savedAt: "",
  };
}

function defaultInvoice() {
  return {
    id: createId("invoice"),
    selectedCustomerId: "",
    documentTitle: "Tax Invoice",
    invoiceNo: defaultInvoiceNumber(),
    invoiceDate: formatCurrentDate(),
    buyerOrderNo: "",
    buyerOrderDate: "",
    referenceNo: "",
    deliveryNote: "",
    paymentTerms: "",
    destination: "",
    sellerName: "Urmila Enterprises",
    sellerAddress:
      "Bhagwan pur kash, near fci godam, jungle nakaha no.2, Gorakhpur, Uttar Pradesh 273007",
    sellerGstin: "09BOEPD4735A1ZE",
    sellerState: "Uttar Pradesh",
    sellerLicense: "FSSAI: 22726626000022",
    sellerEmail: "ramagaya124@gmail.com",
    sellerPan: "",
    consigneeName: "",
    consigneeAddress: "",
    consigneeGstin: "",
    consigneeContactPerson: "",
    consigneeContact: "",
    buyerName: "",
    buyerAddress: "",
    buyerGstin: "",
    placeOfSupply: "",
    buyerContactPerson: "",
    buyerContact: "",
    bankHolder: DEFAULT_BANK_DETAILS.bankHolder,
    bankName: DEFAULT_BANK_DETAILS.bankName,
    bankAccountNo: DEFAULT_BANK_DETAILS.bankAccountNo,
    bankBranchIfsc: DEFAULT_BANK_DETAILS.bankBranchIfsc,
    declaration:
      "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
    footerNote: "This is a computer generated invoice.",
    signatoryLabel: "Authorised Signatory",
    items: [blankItem()],
    savedAt: "",
    autoSequence: null,
  };
}

const sampleData = {
  settings: {
    invoiceSeries: "UE",
    nextInvoiceSequence: 1,
    cloudSavedInvoiceNos: [],
  },
  products: [
    {
      id: createId("product"),
      name: "Bastar Farms-Tamarind Pulp-6.5Kg (Bkt)",
      description: "Bastar Farms-Tamarind Pulp-6.5Kg (Bkt)",
      hsn: "21039090",
      rate: 780,
      purchaseRate: 540,
      unit: "NOS",
      taxRate: 5,
    },
  ],
  customers: [
    {
      id: createId("customer"),
      name: "The Akshayapatra Foundation- Gorakhpur",
      contactPerson: "Shubham Kumar",
      billingAddress:
        "Kustrog, Leprosy Hospital, Rajendra Nagar, Gorakhpur,\nUttar Pradesh - 273015, India",
      shippingAddress:
        "Khasra No. 292, 293, 294, Near Chiluwataal Thana, Jangal Nakaha, Gorakhpur.\nUttar Pradesh - 273015, India",
      gstin: "09AAATT6468P1ZJ",
      contact: "+91 97988 79757, +91 9598681452",
      placeOfSupply: "Uttar Pradesh",
    },
  ],
  invoices: [],
  purchaseBills: [],
  currentInvoice: defaultInvoice(),
  currentPurchaseBill: defaultPurchaseBill(),
};

sampleData.currentInvoice = {
  ...sampleData.currentInvoice,
  sellerName: "Urmila Enterprises",
  sellerAddress:
    "Bhagwan pur kash, near fci godam, jungle nakaha no.2, Gorakhpur, Uttar Pradesh 273007",
  sellerGstin: "09BOEPD4735A1ZE",
  sellerState: "Uttar Pradesh",
  sellerLicense: "FSSAI: 22726626000022",
  sellerEmail: "ramagaya124@gmail.com",
  sellerPan: "",
  buyerName: sampleData.customers[0].name,
  buyerAddress: sampleData.customers[0].billingAddress,
  buyerGstin: sampleData.customers[0].gstin,
  placeOfSupply: sampleData.customers[0].placeOfSupply,
  buyerContactPerson: sampleData.customers[0].contactPerson,
  buyerContact: sampleData.customers[0].contact,
  consigneeName: sampleData.customers[0].name,
  consigneeAddress: sampleData.customers[0].shippingAddress,
  consigneeGstin: sampleData.customers[0].gstin,
  consigneeContactPerson: sampleData.customers[0].contactPerson,
  consigneeContact: sampleData.customers[0].contact,
  selectedCustomerId: sampleData.customers[0].id,
  invoiceNo: formatInvoiceNumber(formatCurrentDate(), sampleData.settings.invoiceSeries, sampleData.settings.nextInvoiceSequence),
  buyerOrderNo: "PO-26GKP-1314-1",
  buyerOrderDate: "13-Feb-26",
  referenceNo: "PO-26GKP-1314-1 dt. 13-Feb-26",
  items: [
    {
      productId: sampleData.products[0].id,
      description: sampleData.products[0].description,
      hsn: sampleData.products[0].hsn,
      quantity: 29,
      rate: 780,
      unit: "NOS",
      taxRate: 5,
      costRate: 540,
    },
  ],
  bankHolder: "Urmila Enterprises",
  bankName: "State Bank of India",
  bankAccountNo: "43639308704",
  bankBranchIfsc: "Rajendra Nagar (Gorakhpur) & SBIN0018455",
  footerNote: "Subject to Bastar jurisdiction. This is a computer generated invoice.",
};

let appState = loadState();
let editingProductId = null;

const form = document.getElementById("invoiceForm");
const itemsEditor = document.getElementById("itemsEditor");
const itemTemplate = document.getElementById("itemEditorTemplate");
const purchaseItemsEditor = document.getElementById("purchaseItemsEditor");
const purchaseItemTemplate = document.getElementById("purchaseItemEditorTemplate");
const grandTotalChip = document.getElementById("grandTotalChip");
const customerSelect = document.getElementById("customerSelect");
const savedInvoicesList = document.getElementById("savedInvoicesList");
const savedPurchasesList = document.getElementById("savedPurchasesList");
const productsList = document.getElementById("productsList");
const customersList = document.getElementById("customersList");
const invoiceSeriesInput = document.getElementById("invoiceSeriesInput");
const nextCounterInput = document.getElementById("nextCounterInput");
const invoicePatternHint = document.getElementById("invoicePatternHint");
const tabButtons = [...document.querySelectorAll(".tab-btn")];
const tabPanels = [...document.querySelectorAll(".tab-panel")];
const authOverlay = document.getElementById("authOverlay");
const authForm = document.getElementById("authForm");
const passwordInput = document.getElementById("passwordInput");
const authError = document.getElementById("authError");
const invoicePreview = document.getElementById("invoicePreview");
const purchasePreview = document.getElementById("purchasePreview");
const productEditHint = document.getElementById("productEditHint");
const importJsonInput = document.getElementById("importJsonInput");
const purchaseFieldIds = [
  "purchaseSupplierName",
  "purchaseSupplierContact",
  "purchaseSupplierAddress",
  "purchaseDate",
  "purchaseBillNo",
  "purchaseNotes",
];

const invoiceFieldNames = [
  "selectedCustomerId",
  "documentTitle",
  "invoiceNo",
  "invoiceDate",
  "buyerOrderNo",
  "buyerOrderDate",
  "referenceNo",
  "deliveryNote",
  "paymentTerms",
  "destination",
  "sellerName",
  "sellerAddress",
  "sellerGstin",
  "sellerState",
  "sellerLicense",
  "sellerEmail",
  "sellerPan",
  "consigneeName",
  "consigneeAddress",
  "consigneeGstin",
  "consigneeContactPerson",
  "consigneeContact",
  "buyerName",
  "buyerAddress",
  "buyerGstin",
  "placeOfSupply",
  "buyerContactPerson",
  "buyerContact",
  "bankHolder",
  "bankName",
  "bankAccountNo",
  "bankBranchIfsc",
  "declaration",
  "footerNote",
  "signatoryLabel",
];

document.getElementById("todayBtn").addEventListener("click", () => {
  appState.currentInvoice.invoiceDate = formatCurrentDate();
  if (appState.currentInvoice.autoSequence) {
    refreshAutoInvoiceNumber();
  }
  syncForm();
  persistState();
  renderPreview();
});

document.getElementById("newInvoiceBtn").addEventListener("click", () => {
  const sellerFields = pickSellerFields(appState.currentInvoice);
  appState.currentInvoice = {
    ...defaultInvoice(),
    ...sellerFields,
  };
  assignNextInvoiceNumber();
  rerenderApp();
});

document.getElementById("saveInvoiceBtn").addEventListener("click", () => {
  saveCurrentInvoice();
});

document.getElementById("saveCloudBtn").addEventListener("click", async () => {
  await saveInvoiceToCloud();
});

document.getElementById("importJsonBtn").addEventListener("click", () => {
  importJsonInput.click();
});

document.getElementById("loadSampleBtn").addEventListener("click", () => {
  appState = structuredClone(sampleData);
  persistState();
  rerenderApp();
});

document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  window.print();
});

document.getElementById("newPurchaseBtn").addEventListener("click", () => {
  appState.currentPurchaseBill = defaultPurchaseBill();
  persistState();
  renderPurchaseSection();
});

document.getElementById("savePurchaseBtn").addEventListener("click", () => {
  saveCurrentPurchaseBill();
});

document.getElementById("printPurchaseBtn").addEventListener("click", () => {
  setActiveTab("purchases");
  window.print();
});

document.getElementById("addPurchaseItemBtn").addEventListener("click", () => {
  appState.currentPurchaseBill.items.push(blankPurchaseItem());
  persistState();
  renderPurchaseItemsEditor();
  renderPurchasePreview();
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (passwordInput.value === ACCESS_PASSWORD) {
    sessionStorage.setItem(ACCESS_SESSION_KEY, "ok");
    hideAuthOverlay();
    return;
  }
  authError.textContent = "Wrong password.";
  passwordInput.select();
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tab);
  });
});

document.getElementById("autoInvoiceNoBtn").addEventListener("click", () => {
  assignNextInvoiceNumber();
  rerenderApp();
});

document.getElementById("addProductBtn").addEventListener("click", () => {
  createProductFromForm();
});

document.getElementById("cancelProductEditBtn").addEventListener("click", () => {
  resetProductEditor();
});

document.getElementById("addCustomerBtn").addEventListener("click", () => {
  createCustomerFromForm();
});

document.getElementById("addLineItemBtn").addEventListener("click", () => {
  appState.currentInvoice.items.push(blankItem());
  persistState();
  renderItemsEditor();
  renderPreview();
});

customerSelect.addEventListener("change", () => {
  applyCustomerToInvoice(customerSelect.value);
});

invoiceSeriesInput.addEventListener("input", () => {
  appState.settings.invoiceSeries = invoiceSeriesInput.value.trim().toUpperCase() || "UE";
  if (appState.currentInvoice.autoSequence) {
    refreshAutoInvoiceNumber();
  }
  persistState();
  renderInvoicePatternHint();
  syncForm();
  renderSavedInvoices();
  renderPreview();
});

nextCounterInput.addEventListener("input", () => {
  const value = Math.max(1, Number(nextCounterInput.value) || 1);
  appState.settings.nextInvoiceSequence = value;
  if (appState.currentInvoice.autoSequence) {
    appState.currentInvoice.autoSequence = value;
    refreshAutoInvoiceNumber();
  }
  persistState();
  renderInvoicePatternHint();
  syncForm();
  renderSavedInvoices();
  renderPreview();
});

form.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return;
  }
  if (!invoiceFieldNames.includes(target.name)) {
    return;
  }

  appState.currentInvoice[target.name] = target.value;
  if (target.name === "buyerName") {
    appState.currentInvoice.selectedCustomerId = "";
    customerSelect.value = "";
  }
  if (target.name === "invoiceDate" && appState.currentInvoice.autoSequence) {
    refreshAutoInvoiceNumber();
    syncForm();
  }
  if (target.name === "invoiceNo") {
    appState.currentInvoice.autoSequence = null;
  }
  persistState();
  renderPreview();
});

purchaseFieldIds.forEach((id) => {
  document.getElementById(id).addEventListener("input", (event) => {
    const keyMap = {
      purchaseSupplierName: "supplierName",
      purchaseSupplierContact: "supplierContact",
      purchaseSupplierAddress: "supplierAddress",
      purchaseDate: "purchaseDate",
      purchaseBillNo: "purchaseBillNo",
      purchaseNotes: "notes",
    };
    appState.currentPurchaseBill[keyMap[id]] = event.target.value;
    persistState();
    renderPurchasePreview();
  });
});

importJsonInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    importInvoiceFromJson(parsed);
    window.alert("Invoice imported successfully.");
  } catch (error) {
    window.alert(`Import failed: ${error.message}`);
  } finally {
    importJsonInput.value = "";
  }
});

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return structuredClone(sampleData);
  }

  try {
    const parsed = JSON.parse(saved);
    if (
      parsed &&
      parsed.settings &&
      Array.isArray(parsed.products) &&
      Array.isArray(parsed.customers) &&
      parsed.currentInvoice
    ) {
      parsed.settings.cloudSavedInvoiceNos = parsed.settings.cloudSavedInvoiceNos || [];
      parsed.purchaseBills = parsed.purchaseBills || [];
      parsed.currentPurchaseBill = parsed.currentPurchaseBill || defaultPurchaseBill();
      migrateLegacyDefaults(parsed);
      return parsed;
    }
  } catch (_error) {
    // Ignore invalid saved data.
  }

  return structuredClone(sampleData);
}

function migrateLegacyDefaults(state) {
  const oldValues = {
    bankHolder: "Kossher Agro Pvt. Ltd.",
    bankName: "Central Bank of India",
    bankAccountNo: "5334646878",
    bankBranchIfsc: "Jagdalpur (Chhattisgarh) & CBIN0280807",
  };

  const invoices = [state.currentInvoice, ...(state.invoices || [])];
  invoices.forEach((invoice) => {
    if (!invoice) {
      return;
    }
    if (!invoice.bankHolder || invoice.bankHolder === oldValues.bankHolder) {
      invoice.bankHolder = DEFAULT_BANK_DETAILS.bankHolder;
    }
    if (!invoice.bankName || invoice.bankName === oldValues.bankName) {
      invoice.bankName = DEFAULT_BANK_DETAILS.bankName;
    }
    if (!invoice.bankAccountNo || invoice.bankAccountNo === oldValues.bankAccountNo) {
      invoice.bankAccountNo = DEFAULT_BANK_DETAILS.bankAccountNo;
    }
    if (!invoice.bankBranchIfsc || invoice.bankBranchIfsc === oldValues.bankBranchIfsc) {
      invoice.bankBranchIfsc = DEFAULT_BANK_DETAILS.bankBranchIfsc;
    }
    (invoice.items || []).forEach((item) => {
      if (typeof item.costRate !== "number") {
        const product = (state.products || []).find((entry) => entry.id === item.productId);
        item.costRate = Number(product?.purchaseRate || 0);
      }
    });
  });

  (state.products || []).forEach((product) => {
    if (typeof product.purchaseRate !== "number") {
      product.purchaseRate = 0;
    }
  });
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function assignNextInvoiceNumber() {
  appState.currentInvoice.autoSequence = appState.settings.nextInvoiceSequence;
  refreshAutoInvoiceNumber();
}

function refreshAutoInvoiceNumber() {
  const sequence = appState.currentInvoice.autoSequence || appState.settings.nextInvoiceSequence;
  appState.currentInvoice.invoiceNo = formatInvoiceNumber(
    appState.currentInvoice.invoiceDate,
    appState.settings.invoiceSeries,
    sequence
  );
}

function pickSellerFields(invoice) {
  return {
    sellerName: invoice.sellerName,
    sellerAddress: invoice.sellerAddress,
    sellerGstin: invoice.sellerGstin,
    sellerState: invoice.sellerState,
    sellerLicense: invoice.sellerLicense,
    sellerEmail: invoice.sellerEmail,
    sellerPan: invoice.sellerPan,
    bankHolder: invoice.bankHolder,
    bankName: invoice.bankName,
    bankAccountNo: invoice.bankAccountNo,
    bankBranchIfsc: invoice.bankBranchIfsc,
    declaration: invoice.declaration,
    footerNote: invoice.footerNote,
    signatoryLabel: invoice.signatoryLabel,
  };
}

function importInvoiceFromJson(data) {
  if (!data) {
    throw new Error("This file is not a supported invoice JSON.");
  }

  if (data.type !== "invoice" && !data.invoiceNo && !data.sellerName) {
    throw new Error("This file is not a supported invoice JSON.");
  }

  if (data.type !== "invoice") {
    importLegacyInvoiceJson(data);
    return;
  }

  const importedInvoice = defaultInvoice();
  importedInvoice.documentTitle = data.document?.title || importedInvoice.documentTitle;
  importedInvoice.invoiceNo = data.invoiceNo || importedInvoice.invoiceNo;
  importedInvoice.invoiceDate = data.invoiceDate || importedInvoice.invoiceDate;
  importedInvoice.buyerOrderNo = data.document?.buyerOrderNo || "";
  importedInvoice.buyerOrderDate = data.document?.buyerOrderDate || "";
  importedInvoice.referenceNo = data.document?.referenceNo || "";
  importedInvoice.deliveryNote = data.document?.deliveryNote || "";
  importedInvoice.paymentTerms = data.document?.paymentTerms || "";
  importedInvoice.destination = data.document?.destination || "";

  importedInvoice.sellerName = data.seller?.name || importedInvoice.sellerName;
  importedInvoice.sellerAddress = data.seller?.address || "";
  importedInvoice.sellerGstin = data.seller?.gstin || "";
  importedInvoice.sellerState = data.seller?.state || "";
  importedInvoice.sellerLicense = data.seller?.license || "";
  importedInvoice.sellerEmail = data.seller?.email || "";
  importedInvoice.sellerPan = data.seller?.pan || "";

  importedInvoice.buyerName = data.buyer?.name || "";
  importedInvoice.buyerAddress = data.buyer?.address || "";
  importedInvoice.buyerGstin = data.buyer?.gstin || "";
  importedInvoice.placeOfSupply = data.buyer?.placeOfSupply || "";
  importedInvoice.buyerContactPerson = data.buyer?.contactPerson || "";
  importedInvoice.buyerContact = data.buyer?.contact || "";

  importedInvoice.consigneeName = data.consignee?.name || "";
  importedInvoice.consigneeAddress = data.consignee?.address || "";
  importedInvoice.consigneeGstin = data.consignee?.gstin || "";
  importedInvoice.consigneeContactPerson = data.consignee?.contactPerson || "";
  importedInvoice.consigneeContact = data.consignee?.contact || "";

  importedInvoice.bankHolder = data.bank?.accountHolder || importedInvoice.bankHolder;
  importedInvoice.bankName = data.bank?.bankName || importedInvoice.bankName;
  importedInvoice.bankAccountNo = data.bank?.accountNo || importedInvoice.bankAccountNo;
  importedInvoice.bankBranchIfsc = data.bank?.branchIfsc || importedInvoice.bankBranchIfsc;

  importedInvoice.declaration = data.declaration || importedInvoice.declaration;
  importedInvoice.footerNote = data.footerNote || importedInvoice.footerNote;
  importedInvoice.signatoryLabel = data.signatoryLabel || importedInvoice.signatoryLabel;
  importedInvoice.savedAt = data.savedAt || "";
  importedInvoice.autoSequence = null;

  importedInvoice.items = Array.isArray(data.items) && data.items.length > 0
    ? data.items.map((item) => ({
        productId: "",
        description: item.description || "",
        hsn: item.hsn || "",
        quantity: Number(item.quantity || 0),
        rate: Number(item.rate || 0),
        unit: item.unit || "NOS",
        taxRate: Number(item.taxRate || 0),
        costRate: Number(item.purchaseCost || 0),
      }))
    : [blankItem()];

  appState.currentInvoice = importedInvoice;
  appState.currentInvoice.selectedCustomerId = "";
  persistState();
  rerenderApp();
  setActiveTab("billing");
}

function importLegacyInvoiceJson(data) {
  const importedInvoice = defaultInvoice();
  importedInvoice.documentTitle = data.documentTitle || importedInvoice.documentTitle;
  importedInvoice.invoiceNo = data.invoiceNo || importedInvoice.invoiceNo;
  importedInvoice.invoiceDate = data.invoiceDate || importedInvoice.invoiceDate;
  importedInvoice.buyerOrderNo = data.buyerOrderNo || "";
  importedInvoice.buyerOrderDate = data.buyerOrderDate || "";
  importedInvoice.referenceNo = data.referenceNo || "";
  importedInvoice.deliveryNote = data.deliveryNote || "";
  importedInvoice.paymentTerms = data.paymentTerms || "";
  importedInvoice.destination = data.destination || "";

  importedInvoice.sellerName = data.sellerName || importedInvoice.sellerName;
  importedInvoice.sellerAddress = data.sellerAddress || "";
  importedInvoice.sellerGstin = data.sellerGstin || "";
  importedInvoice.sellerState = data.sellerState || "";
  importedInvoice.sellerLicense = data.sellerLicense || "";
  importedInvoice.sellerEmail = data.sellerEmail || "";
  importedInvoice.sellerPan = data.sellerPan || "";

  importedInvoice.buyerName = data.buyerName || "";
  importedInvoice.buyerAddress = data.buyerAddress || "";
  importedInvoice.buyerGstin = data.buyerGstin || "";
  importedInvoice.placeOfSupply = data.placeOfSupply || "";
  importedInvoice.buyerContactPerson = data.buyerContactPerson || "";
  importedInvoice.buyerContact = data.buyerContact || "";

  importedInvoice.consigneeName = data.consigneeName || "";
  importedInvoice.consigneeAddress = data.consigneeAddress || "";
  importedInvoice.consigneeGstin = data.consigneeGstin || "";
  importedInvoice.consigneeContactPerson = data.consigneeContactPerson || "";
  importedInvoice.consigneeContact = data.consigneeContact || "";

  importedInvoice.bankHolder = data.bankHolder || importedInvoice.bankHolder;
  importedInvoice.bankName = data.bankName || importedInvoice.bankName;
  importedInvoice.bankAccountNo = data.bankAccountNo || importedInvoice.bankAccountNo;
  importedInvoice.bankBranchIfsc = data.bankBranchIfsc || importedInvoice.bankBranchIfsc;

  importedInvoice.declaration = data.declaration || importedInvoice.declaration;
  importedInvoice.footerNote = data.footerNote || importedInvoice.footerNote;
  importedInvoice.signatoryLabel = data.signatoryLabel || importedInvoice.signatoryLabel;
  importedInvoice.savedAt = data.savedAt || "";
  importedInvoice.autoSequence = null;

  importedInvoice.items = Array.isArray(data.items) && data.items.length > 0
    ? data.items.map((item) => ({
        productId: item.productId || "",
        description: item.description || "",
        hsn: item.hsn || "",
        quantity: Number(item.quantity || 0),
        rate: Number(item.rate || 0),
        unit: item.unit || "NOS",
        taxRate: Number(item.taxRate || 0),
        costRate: Number(item.costRate || 0),
      }))
    : [blankItem()];

  appState.currentInvoice = importedInvoice;
  appState.currentInvoice.selectedCustomerId = data.selectedCustomerId || "";
  persistState();
  rerenderApp();
  setActiveTab("billing");
}

function createProductFromForm() {
  const name = getValue("productName");
  if (!name) {
    window.alert("Enter a product name first.");
    return;
  }

  const payload = {
    id: editingProductId || createId("product"),
    name,
    description: getValue("productDescription") || name,
    hsn: getValue("productHsn"),
    rate: Number(getValue("productRate") || 0),
    purchaseRate: Number(getValue("productPurchaseRate") || 0),
    unit: getValue("productUnit") || "NOS",
    taxRate: Number(getValue("productTaxRate") || 0),
  };

  if (editingProductId) {
    const index = appState.products.findIndex((entry) => entry.id === editingProductId);
    if (index >= 0) {
      appState.products[index] = payload;
    }
    appState.currentInvoice.items = appState.currentInvoice.items.map((item) =>
      item.productId === editingProductId
        ? {
            ...item,
            description: payload.description,
            hsn: payload.hsn,
            rate: payload.rate,
            costRate: payload.purchaseRate,
            unit: payload.unit,
            taxRate: payload.taxRate,
          }
        : item
    );
    appState.currentPurchaseBill.items = appState.currentPurchaseBill.items.map((item) =>
      item.productId === editingProductId
        ? {
            ...item,
            description: payload.description,
            rate: payload.purchaseRate,
            unit: payload.unit,
          }
        : item
    );
  } else {
    appState.products.unshift(payload);
  }

  resetProductEditor();
  persistState();
  renderProductCatalog();
  renderItemsEditor();
  renderPurchaseItemsEditor();
  renderPreview();
  renderPurchasePreview();
}

function resetProductEditor() {
  editingProductId = null;
  clearInputs([
    "productName",
    "productDescription",
    "productHsn",
    "productRate",
    "productPurchaseRate",
    "productUnit",
    "productTaxRate",
  ]);
  updateProductEditorUi();
}

function startProductEdit(productId) {
  const product = appState.products.find((entry) => entry.id === productId);
  if (!product) {
    return;
  }
  editingProductId = productId;
  document.getElementById("productName").value = product.name || "";
  document.getElementById("productDescription").value = product.description || "";
  document.getElementById("productHsn").value = product.hsn || "";
  document.getElementById("productRate").value = product.rate ?? "";
  document.getElementById("productPurchaseRate").value = product.purchaseRate ?? "";
  document.getElementById("productUnit").value = product.unit || "";
  document.getElementById("productTaxRate").value = product.taxRate ?? "";
  updateProductEditorUi();
}

function updateProductEditorUi() {
  const addButton = document.getElementById("addProductBtn");
  const cancelButton = document.getElementById("cancelProductEditBtn");
  if (editingProductId) {
    addButton.textContent = "Update product";
    cancelButton.style.display = "inline-flex";
    const product = appState.products.find((entry) => entry.id === editingProductId);
    productEditHint.textContent = product ? `Editing: ${product.name}` : "Editing product";
  } else {
    addButton.textContent = "Add product";
    cancelButton.style.display = "none";
    productEditHint.textContent = "";
  }
}

function createCustomerFromForm() {
  const name = getValue("customerName");
  if (!name) {
    window.alert("Enter a customer name first.");
    return;
  }

  appState.customers.unshift({
    id: createId("customer"),
    name,
    contactPerson: getValue("customerContactPerson"),
    billingAddress: getValue("customerBillingAddress"),
    shippingAddress: getValue("customerShippingAddress") || getValue("customerBillingAddress"),
    gstin: getValue("customerGstin"),
    contact: getValue("customerContact"),
    placeOfSupply: getValue("customerPlaceOfSupply"),
  });

  clearInputs([
    "customerName",
    "customerContactPerson",
    "customerBillingAddress",
    "customerShippingAddress",
    "customerGstin",
    "customerContact",
    "customerPlaceOfSupply",
  ]);
  persistState();
  renderCustomerCatalog();
  renderCustomerOptions();
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function clearInputs(ids) {
  ids.forEach((id) => {
    document.getElementById(id).value = "";
  });
}

function applyCustomerToInvoice(customerId) {
  const customer = appState.customers.find((entry) => entry.id === customerId);
  appState.currentInvoice.selectedCustomerId = customerId;
  if (!customer) {
    persistState();
    renderPreview();
    return;
  }

  appState.currentInvoice.buyerName = customer.name;
  appState.currentInvoice.buyerAddress = customer.billingAddress;
  appState.currentInvoice.buyerGstin = customer.gstin;
  appState.currentInvoice.placeOfSupply = customer.placeOfSupply;
  appState.currentInvoice.buyerContactPerson = customer.contactPerson;
  appState.currentInvoice.buyerContact = customer.contact;
  appState.currentInvoice.consigneeName = customer.name;
  appState.currentInvoice.consigneeAddress = customer.shippingAddress;
  appState.currentInvoice.consigneeGstin = customer.gstin;
  appState.currentInvoice.consigneeContactPerson = customer.contactPerson;
  appState.currentInvoice.consigneeContact = customer.contact;

  syncForm();
  persistState();
  renderPreview();
}

function renderCustomerOptions() {
  const selected = appState.currentInvoice.selectedCustomerId || "";
  customerSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select customer";
  customerSelect.appendChild(placeholder);

  appState.customers.forEach((customer) => {
    const option = document.createElement("option");
    option.value = customer.id;
    option.textContent = customer.name;
    customerSelect.appendChild(option);
  });

  customerSelect.value = selected;
}

function syncForm() {
  for (const element of form.elements) {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
    ) {
      if (invoiceFieldNames.includes(element.name)) {
        element.value = appState.currentInvoice[element.name] ?? "";
      }
    }
  }
  customerSelect.value = appState.currentInvoice.selectedCustomerId || "";
  invoiceSeriesInput.value = appState.settings.invoiceSeries || "UE";
  nextCounterInput.value = appState.settings.nextInvoiceSequence || 1;
  renderInvoicePatternHint();
}

function syncPurchaseForm() {
  const purchase = appState.currentPurchaseBill;
  document.getElementById("purchaseSupplierName").value = purchase.supplierName || "";
  document.getElementById("purchaseSupplierContact").value = purchase.supplierContact || "";
  document.getElementById("purchaseSupplierAddress").value = purchase.supplierAddress || "";
  document.getElementById("purchaseDate").value = purchase.purchaseDate || "";
  document.getElementById("purchaseBillNo").value = purchase.purchaseBillNo || "";
  document.getElementById("purchaseNotes").value = purchase.notes || "";
}

function renderInvoicePatternHint() {
  invoicePatternHint.textContent = `Pattern: ${formatInvoiceNumber(
    appState.currentInvoice.invoiceDate,
    appState.settings.invoiceSeries,
    appState.settings.nextInvoiceSequence
  )}`;
}

function setActiveTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === tabName);
  });
  invoicePreview.classList.toggle("active", tabName !== "purchases");
  purchasePreview.classList.toggle("active", tabName === "purchases");
  if (tabName === "purchases") {
    const totals = buildPurchaseTotals();
    grandTotalChip.textContent = `Purchase Total ${formatCurrency(totals.grandTotal)}`;
  } else {
    const totals = buildTotals();
    grandTotalChip.textContent = `Grand Total ${formatCurrency(totals.grandTotal)}`;
  }
}

function showAuthOverlay() {
  authOverlay.classList.add("visible");
  document.body.classList.add("locked");
  passwordInput.focus();
}

function hideAuthOverlay() {
  authOverlay.classList.remove("visible");
  document.body.classList.remove("locked");
  authError.textContent = "";
  passwordInput.value = "";
}

function renderItemsEditor() {
  itemsEditor.innerHTML = "";

  appState.currentInvoice.items.forEach((item, index) => {
    const fragment = itemTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".item-editor-card");
    card.querySelector(".item-index").textContent = `Line ${index + 1}`;

    const productSelect = fragment.querySelector(".item-product-select");
    productSelect.innerHTML = "";
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Select product";
    productSelect.appendChild(emptyOption);

    appState.products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = `${product.name} (${formatCurrency(product.rate)})`;
      productSelect.appendChild(option);
    });
    productSelect.value = item.productId || "";
    productSelect.addEventListener("change", () => {
      const product = appState.products.find((entry) => entry.id === productSelect.value);
      item.productId = productSelect.value;
      if (product) {
        item.description = product.description || product.name;
        item.hsn = product.hsn;
        item.rate = Number(product.rate || 0);
        item.costRate = Number(product.purchaseRate || 0);
        item.unit = product.unit || "NOS";
        item.taxRate = Number(product.taxRate || 0);
      }
      persistState();
      renderItemsEditor();
      renderPreview();
    });

    card.querySelectorAll("[data-field]").forEach((field) => {
      const key = field.getAttribute("data-field");
      if (key === "productId") {
        return;
      }
      field.value = item[key] ?? "";
      field.addEventListener("input", (event) => {
        const value = event.target.value;
        item[key] = ["quantity", "rate", "taxRate"].includes(key)
          ? Number(value || 0)
          : value;
        persistState();
        renderPreview();
      });
    });

    card.querySelector(".remove-item-btn").addEventListener("click", () => {
      appState.currentInvoice.items.splice(index, 1);
      if (appState.currentInvoice.items.length === 0) {
        appState.currentInvoice.items.push(blankItem());
      }
      persistState();
      renderItemsEditor();
      renderPreview();
    });

    itemsEditor.appendChild(fragment);
  });
}

function renderProductCatalog() {
  productsList.innerHTML = "";
  appState.products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "saved-card";
    card.innerHTML = `
      <div>
        <strong>${escapeHtml(product.name)}</strong>
        <p>${escapeHtml(product.hsn || "-")} | ${escapeHtml(product.unit || "-")} | Sale ${formatCurrency(product.rate)} | Buy ${formatCurrency(product.purchaseRate || 0)} | ${formatNumber(product.taxRate)}%</p>
      </div>
      <div class="saved-card-actions">
        <button class="btn mini secondary" type="button">Edit</button>
        <button class="btn mini danger" type="button">Delete</button>
      </div>
    `;
    const [editButton, deleteButton] = card.querySelectorAll("button");
    editButton.addEventListener("click", () => {
      startProductEdit(product.id);
      setActiveTab("products");
    });
    deleteButton.addEventListener("click", () => {
      appState.products = appState.products.filter((entry) => entry.id !== product.id);
      appState.currentInvoice.items = appState.currentInvoice.items.map((item) =>
        item.productId === product.id ? { ...item, productId: "" } : item
      );
      appState.currentPurchaseBill.items = appState.currentPurchaseBill.items.map((item) =>
        item.productId === product.id ? { ...item, productId: "" } : item
      );
      if (editingProductId === product.id) {
        resetProductEditor();
      }
      persistState();
      renderProductCatalog();
      renderItemsEditor();
      renderPurchaseItemsEditor();
      renderPreview();
      renderPurchasePreview();
    });
    productsList.appendChild(card);
  });
}

function renderCustomerCatalog() {
  customersList.innerHTML = "";
  appState.customers.forEach((customer) => {
    const card = document.createElement("div");
    card.className = "saved-card";
    card.innerHTML = `
      <div>
        <strong>${escapeHtml(customer.name)}</strong>
        <p>${escapeHtml(customer.contactPerson || "-")} | ${escapeHtml(customer.contact || "-")}</p>
      </div>
      <div class="saved-card-actions">
        <button class="btn mini secondary" type="button">Use</button>
        <button class="btn mini danger" type="button">Delete</button>
      </div>
    `;
    const [useButton, deleteButton] = card.querySelectorAll("button");
    useButton.addEventListener("click", () => {
      customerSelect.value = customer.id;
      applyCustomerToInvoice(customer.id);
    });
    deleteButton.addEventListener("click", () => {
      appState.customers = appState.customers.filter((entry) => entry.id !== customer.id);
      if (appState.currentInvoice.selectedCustomerId === customer.id) {
        appState.currentInvoice.selectedCustomerId = "";
      }
      persistState();
      renderCustomerCatalog();
      renderCustomerOptions();
      syncForm();
      renderPreview();
    });
    customersList.appendChild(card);
  });
}

function saveCurrentInvoice() {
  if (!appState.currentInvoice.invoiceNo.trim()) {
    assignNextInvoiceNumber();
  }
  const snapshot = structuredClone(appState.currentInvoice);
  snapshot.savedAt = new Date().toLocaleString("en-IN");
  const existingIndex = appState.invoices.findIndex((entry) => entry.id === snapshot.id);
  if (existingIndex >= 0) {
    appState.invoices[existingIndex] = snapshot;
  } else {
    appState.invoices.unshift(snapshot);
  }
  persistState();
  renderSavedInvoices();
  syncForm();
  renderPreview();
  window.alert("Invoice saved.");
}

async function saveInvoiceToCloud() {
  if (!appState.currentInvoice.invoiceNo.trim()) {
    assignNextInvoiceNumber();
    syncForm();
    renderPreview();
  }

  const invoiceNo = appState.currentInvoice.invoiceNo.trim();
  const usedInvoiceNos = appState.settings.cloudSavedInvoiceNos || [];
  if (usedInvoiceNos.includes(invoiceNo)) {
    if (appState.currentInvoice.autoSequence) {
      assignNextInvoiceNumber();
      syncForm();
      renderPreview();
      window.alert(`Invoice no. ${invoiceNo} was already cloud-saved. Moved to the next invoice number.`);
    } else {
      window.alert(`Invoice no. ${invoiceNo} was already cloud-saved. Change it or click Auto invoice no.`);
    }
    return;
  }

  const payload = buildCloudInvoicePayload();

  try {
    const response = await fetch(CLOUD_SAVE_API_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!result.ok) {
      throw new Error(result.error || "Cloud save failed");
    }

    appState.settings.cloudSavedInvoiceNos = [...usedInvoiceNos, invoiceNo];

    if (
      appState.currentInvoice.autoSequence &&
      appState.currentInvoice.autoSequence >= appState.settings.nextInvoiceSequence
    ) {
      appState.settings.nextInvoiceSequence = appState.currentInvoice.autoSequence + 1;
    }

    const sellerFields = pickSellerFields(appState.currentInvoice);
    appState.currentInvoice = {
      ...defaultInvoice(),
      ...sellerFields,
    };
    assignNextInvoiceNumber();
    persistState();
    rerenderApp();
    setActiveTab("billing");

    window.alert(`Saved to cloud as ${result.fileName}`);
  } catch (error) {
    window.alert(`Cloud save failed: ${error.message}`);
  }
}

function buildCloudInvoicePayload() {
  const invoice = appState.currentInvoice;
  const totals = buildTotals();

  return {
    type: "invoice",
    app: "Vishal Special invoice maker",
    version: 1,
    invoiceNo: invoice.invoiceNo,
    invoiceDate: invoice.invoiceDate,
    savedAt: new Date().toLocaleString("en-IN"),
    document: {
      title: invoice.documentTitle,
      buyerOrderNo: invoice.buyerOrderNo,
      buyerOrderDate: invoice.buyerOrderDate,
      referenceNo: invoice.referenceNo,
      deliveryNote: invoice.deliveryNote,
      paymentTerms: invoice.paymentTerms,
      destination: invoice.destination,
    },
    seller: {
      name: invoice.sellerName,
      address: invoice.sellerAddress,
      gstin: invoice.sellerGstin,
      state: invoice.sellerState,
      license: invoice.sellerLicense,
      email: invoice.sellerEmail,
      pan: invoice.sellerPan,
    },
    buyer: {
      name: invoice.buyerName,
      address: invoice.buyerAddress,
      gstin: invoice.buyerGstin,
      placeOfSupply: invoice.placeOfSupply,
      contactPerson: invoice.buyerContactPerson,
      contact: invoice.buyerContact,
    },
    consignee: {
      name: invoice.consigneeName,
      address: invoice.consigneeAddress,
      gstin: invoice.consigneeGstin,
      contactPerson: invoice.consigneeContactPerson,
      contact: invoice.consigneeContact,
    },
    bank: {
      accountHolder: invoice.bankHolder,
      bankName: invoice.bankName,
      accountNo: invoice.bankAccountNo,
      branchIfsc: invoice.bankBranchIfsc,
    },
    items: invoice.items.map((item, index) => ({
      lineNo: index + 1,
      description: item.description,
      hsn: item.hsn,
      quantity: Number(item.quantity || 0),
      rate: Number(item.rate || 0),
      unit: item.unit,
      taxRate: Number(item.taxRate || 0),
      amount: Number(item.quantity || 0) * Number(item.rate || 0),
      purchaseCost: Number(item.costRate || 0),
    })),
    totals: {
      subtotal: totals.subtotal,
      taxTotal: totals.taxTotal,
      grandTotal: totals.grandTotal,
      estimatedProfit: totals.profitTotal,
      grandTotalInWords: numberToWordsIndian(totals.grandTotal),
      taxAmountInWords: numberToWordsIndian(totals.taxTotal),
    },
    declaration: invoice.declaration,
    footerNote: invoice.footerNote,
    signatoryLabel: invoice.signatoryLabel,
  };
}

function buildPurchaseTotals() {
  let grandTotal = 0;
  const itemRows = appState.currentPurchaseBill.items.map((item, index) => {
    const quantity = Number(item.quantity || 0);
    const rate = Number(item.rate || 0);
    const amount = quantity * rate;
    grandTotal += amount;
    return {
      index: index + 1,
      description: item.description || "-",
      quantity,
      rate,
      unit: item.unit || "-",
      amount,
    };
  });
  return { itemRows, grandTotal };
}

function saveCurrentPurchaseBill() {
  const snapshot = structuredClone(appState.currentPurchaseBill);
  snapshot.savedAt = new Date().toLocaleString("en-IN");
  const existingIndex = appState.purchaseBills.findIndex((entry) => entry.id === snapshot.id);
  if (existingIndex >= 0) {
    appState.purchaseBills[existingIndex] = snapshot;
  } else {
    appState.purchaseBills.unshift(snapshot);
  }

  snapshot.items.forEach((item) => {
    if (!item.productId) {
      return;
    }
    const product = appState.products.find((entry) => entry.id === item.productId);
    if (product) {
      product.purchaseRate = Number(item.rate || 0);
      if (!product.unit && item.unit) {
        product.unit = item.unit;
      }
    }
  });

  persistState();
  renderProductCatalog();
  renderItemsEditor();
  renderPurchaseSection();
  window.alert("Purchase bill saved.");
}

function renderPurchaseItemsEditor() {
  purchaseItemsEditor.innerHTML = "";

  appState.currentPurchaseBill.items.forEach((item, index) => {
    const fragment = purchaseItemTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".item-editor-card");
    card.querySelector(".item-index").textContent = `Line ${index + 1}`;

    const productSelect = fragment.querySelector(".purchase-product-select");
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Select product";
    productSelect.appendChild(emptyOption);
    appState.products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = product.name;
      productSelect.appendChild(option);
    });
    productSelect.value = item.productId || "";
    productSelect.addEventListener("change", () => {
      const product = appState.products.find((entry) => entry.id === productSelect.value);
      item.productId = productSelect.value;
      if (product) {
        item.description = product.description || product.name;
        item.rate = Number(product.purchaseRate || 0);
        item.unit = product.unit || "NOS";
      }
      persistState();
      renderPurchaseItemsEditor();
      renderPurchasePreview();
    });

    card.querySelectorAll("[data-field]").forEach((field) => {
      const key = field.getAttribute("data-field");
      if (key === "productId") {
        return;
      }
      field.value = item[key] ?? "";
      field.addEventListener("input", (event) => {
        const value = event.target.value;
        item[key] = ["quantity", "rate"].includes(key) ? Number(value || 0) : value;
        persistState();
        renderPurchasePreview();
      });
    });

    card.querySelector(".remove-purchase-item-btn").addEventListener("click", () => {
      appState.currentPurchaseBill.items.splice(index, 1);
      if (appState.currentPurchaseBill.items.length === 0) {
        appState.currentPurchaseBill.items.push(blankPurchaseItem());
      }
      persistState();
      renderPurchaseItemsEditor();
      renderPurchasePreview();
    });

    purchaseItemsEditor.appendChild(fragment);
  });
}

function renderSavedPurchases() {
  savedPurchasesList.innerHTML = "";
  document.getElementById("savedPurchaseCount").textContent = `${appState.purchaseBills.length} saved`;

  if (appState.purchaseBills.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No purchase bills saved yet.";
    savedPurchasesList.appendChild(empty);
    return;
  }

  appState.purchaseBills.forEach((bill) => {
    const totals = bill.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0), 0);
    const card = document.createElement("div");
    card.className = "saved-card";
    card.innerHTML = `
      <div>
        <strong>${escapeHtml(bill.purchaseBillNo || "Purchase bill")}</strong>
        <p>${escapeHtml(bill.supplierName || "-")} | ${escapeHtml(bill.purchaseDate || "-")}</p>
        <p>${formatCurrency(totals)}</p>
      </div>
      <div class="saved-card-actions">
        <button class="btn mini secondary" type="button">Open</button>
        <button class="btn mini danger" type="button">Delete</button>
      </div>
    `;
    const [openButton, deleteButton] = card.querySelectorAll("button");
    openButton.addEventListener("click", () => {
      appState.currentPurchaseBill = structuredClone(bill);
      persistState();
      renderPurchaseSection();
    });
    deleteButton.addEventListener("click", () => {
      appState.purchaseBills = appState.purchaseBills.filter((entry) => entry.id !== bill.id);
      persistState();
      renderSavedPurchases();
    });
    savedPurchasesList.appendChild(card);
  });
}

function renderSavedInvoices() {
  savedInvoicesList.innerHTML = "";
  document.getElementById("savedInvoiceCount").textContent = `${appState.invoices.length} saved`;

  if (appState.invoices.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No invoices saved yet.";
    savedInvoicesList.appendChild(empty);
    return;
  }

  appState.invoices.forEach((invoice) => {
    const card = document.createElement("div");
    card.className = "saved-card";
    card.innerHTML = `
      <div>
        <strong>${escapeHtml(invoice.invoiceNo || "Untitled invoice")}</strong>
        <p>${escapeHtml(invoice.buyerName || "-")} | ${escapeHtml(invoice.invoiceDate || "-")}</p>
        <p>${escapeHtml(invoice.savedAt || "")}</p>
      </div>
      <div class="saved-card-actions">
        <button class="btn mini secondary" type="button">Open</button>
        <button class="btn mini danger" type="button">Delete</button>
      </div>
    `;
    const [openButton, deleteButton] = card.querySelectorAll("button");
    openButton.addEventListener("click", () => {
      appState.currentInvoice = structuredClone(invoice);
      rerenderApp();
    });
    deleteButton.addEventListener("click", () => {
      appState.invoices = appState.invoices.filter((entry) => entry.id !== invoice.id);
      persistState();
      renderSavedInvoices();
    });
    savedInvoicesList.appendChild(card);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Number(value || 0));
}

function numberToWordsIndian(value) {
  const rounded = Math.round(Number(value) || 0);
  if (rounded === 0) {
    return "INR Zero Only";
  }

  const belowTwenty = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function underThousand(num) {
    let output = "";
    if (num >= 100) {
      output += `${belowTwenty[Math.floor(num / 100)]} Hundred `;
      num %= 100;
    }
    if (num >= 20) {
      output += `${tens[Math.floor(num / 10)]} `;
      num %= 10;
    }
    if (num > 0) {
      output += `${belowTwenty[num]} `;
    }
    return output.trim();
  }

  const parts = [];
  const crore = Math.floor(rounded / 10000000);
  const lakh = Math.floor((rounded % 10000000) / 100000);
  const thousand = Math.floor((rounded % 100000) / 1000);
  const remainder = rounded % 1000;

  if (crore) {
    parts.push(`${underThousand(crore)} Crore`);
  }
  if (lakh) {
    parts.push(`${underThousand(lakh)} Lakh`);
  }
  if (thousand) {
    parts.push(`${underThousand(thousand)} Thousand`);
  }
  if (remainder) {
    parts.push(underThousand(remainder));
  }

  return `INR ${parts.join(" ").replace(/\s+/g, " ").trim()} Only`;
}

function setText(id, value) {
  document.getElementById(id).textContent = value || "-";
}

function setMultilineText(id, value) {
  const node = document.getElementById(id);
  node.innerHTML = "";
  const lines = String(value || "-").split("\n");
  lines.forEach((line, index) => {
    if (index > 0) {
      node.appendChild(document.createElement("br"));
    }
    node.appendChild(document.createTextNode(line || ""));
  });
}

function buildTotals() {
  const taxMap = new Map();
  let subtotal = 0;
  let taxTotal = 0;
  let profitTotal = 0;

  const itemRows = appState.currentInvoice.items.map((item, index) => {
    const quantity = Number(item.quantity || 0);
    const rate = Number(item.rate || 0);
    const taxRate = Number(item.taxRate || 0);
    const costRate = Number(item.costRate || 0);
    const amount = quantity * rate;
    const taxAmount = (amount * taxRate) / 100;
    const profitAmount = quantity * (rate - costRate);
    subtotal += amount;
    taxTotal += taxAmount;
    profitTotal += profitAmount;

    const key = `${item.hsn || "-"}__${taxRate}`;
    const existing = taxMap.get(key) || {
      hsn: item.hsn || "-",
      taxRate,
      taxableValue: 0,
      taxAmount: 0,
    };
    existing.taxableValue += amount;
    existing.taxAmount += taxAmount;
    taxMap.set(key, existing);

    return {
      index: index + 1,
      description: item.description || "-",
      hsn: item.hsn || "-",
      quantity,
      rate,
      unit: item.unit || "-",
      taxRate,
      costRate,
      amount,
      profitAmount,
    };
  });

  return {
    itemRows,
    subtotal,
    taxTotal,
    profitTotal,
    grandTotal: subtotal + taxTotal,
    taxBreakup: [...taxMap.values()],
  };
}

function renderPreview() {
  const invoice = appState.currentInvoice;
  const totals = buildTotals();

  setText("billingInvoiceNo", invoice.invoiceNo);
  setText("billingInvoiceDate", invoice.invoiceDate);
  setText("billingCustomerName", invoice.buyerName || "Select customer");
  setText("billingProfit", formatCurrency(totals.profitTotal));

  setText("previewDocumentTitle", invoice.documentTitle);
  setText("previewSellerName", invoice.sellerName);
  setText("previewSellerLicense", invoice.sellerLicense);
  setMultilineText("previewSellerAddress", invoice.sellerAddress);
  setText("previewSellerGstin", invoice.sellerGstin);
  setText("previewSellerState", invoice.sellerState);
  setText("previewSellerEmail", invoice.sellerEmail);
  setText("previewInvoiceNo", invoice.invoiceNo);
  setText("previewInvoiceDate", invoice.invoiceDate);
  setText("previewBuyerOrderNo", invoice.buyerOrderNo);
  setText("previewBuyerOrderDate", invoice.buyerOrderDate);
  setText("previewReferenceNo", invoice.referenceNo);
  setText("previewDeliveryNote", invoice.deliveryNote);
  setText("previewPaymentTerms", invoice.paymentTerms);
  setText("previewDestination", invoice.destination);
  setText("previewConsigneeName", invoice.consigneeName);
  setMultilineText("previewConsigneeAddress", invoice.consigneeAddress);
  setText("previewConsigneeGstin", invoice.consigneeGstin);
  setText("previewConsigneeContactPerson", invoice.consigneeContactPerson);
  setText("previewConsigneeContact", invoice.consigneeContact);
  setText("previewBuyerName", invoice.buyerName);
  setMultilineText("previewBuyerAddress", invoice.buyerAddress);
  setText("previewBuyerGstin", invoice.buyerGstin);
  setText("previewPlaceOfSupply", invoice.placeOfSupply);
  setText("previewBuyerContactPerson", invoice.buyerContactPerson);
  setText("previewBuyerContact", invoice.buyerContact);
  setText("previewAmountWords", numberToWordsIndian(totals.grandTotal));
  setText("previewTaxWords", numberToWordsIndian(totals.taxTotal));
  setText("previewSubtotal", formatCurrency(totals.subtotal));
  setText("previewTaxTotal", formatCurrency(totals.taxTotal));
  setText("previewGrandTotal", formatCurrency(totals.grandTotal));
  setText("previewDeclaration", invoice.declaration);
  setText("previewSellerPan", invoice.sellerPan);
  setText("previewBankHolder", invoice.bankHolder);
  setText("previewBankName", invoice.bankName);
  setText("previewBankAccountNo", invoice.bankAccountNo);
  setText("previewBankBranchIfsc", invoice.bankBranchIfsc);
  setText("previewSignatureCompany", invoice.sellerName);
  setText("previewSignatoryLabel", invoice.signatoryLabel);
  setText("previewFooterNote", invoice.footerNote);

  const itemBody = document.getElementById("previewItemsBody");
  itemBody.innerHTML = "";
  totals.itemRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.index}</td>
      <td>${escapeHtml(row.description)}</td>
      <td>${escapeHtml(row.hsn)}</td>
      <td>${formatNumber(row.quantity)}</td>
      <td>${formatCurrency(row.rate)}</td>
      <td>${escapeHtml(row.unit)}</td>
      <td>${formatNumber(row.taxRate)}%</td>
      <td>${formatCurrency(row.amount)}</td>
    `;
    itemBody.appendChild(tr);
  });

  const taxBody = document.getElementById("previewTaxBreakup");
  taxBody.innerHTML = "";
  totals.taxBreakup.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(row.hsn)}</td>
      <td>${formatCurrency(row.taxableValue)}</td>
      <td>${formatNumber(row.taxRate)}%</td>
      <td>${formatCurrency(row.taxAmount)}</td>
    `;
    taxBody.appendChild(tr);
  });

  grandTotalChip.textContent = `Grand Total ${formatCurrency(totals.grandTotal)}`;
}

function renderPurchasePreview() {
  const purchase = appState.currentPurchaseBill;
  const totals = buildPurchaseTotals();

  setText("previewPurchaseCompany", appState.currentInvoice.sellerName);
  setMultilineText("previewPurchaseCompanyAddress", appState.currentInvoice.sellerAddress);
  setText("previewPurchaseBillNo", purchase.purchaseBillNo);
  setText("previewPurchaseDate", purchase.purchaseDate);
  setText("previewPurchaseSupplier", purchase.supplierName);
  setText("previewPurchaseSupplierContact", purchase.supplierContact);
  setText("previewPurchaseSupplierName", purchase.supplierName);
  setMultilineText("previewPurchaseSupplierAddress", purchase.supplierAddress);
  setText("previewPurchaseNotes", purchase.notes);
  setText("previewPurchaseAmountWords", numberToWordsIndian(totals.grandTotal));
  setText("previewPurchaseGrandTotal", formatCurrency(totals.grandTotal));

  const body = document.getElementById("previewPurchaseItemsBody");
  body.innerHTML = "";
  totals.itemRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.index}</td>
      <td>${escapeHtml(row.description)}</td>
      <td>${formatNumber(row.quantity)}</td>
      <td>${formatCurrency(row.rate)}</td>
      <td>${escapeHtml(row.unit)}</td>
      <td>${formatCurrency(row.amount)}</td>
    `;
    body.appendChild(tr);
  });

  if (purchasePreview.classList.contains("active")) {
    grandTotalChip.textContent = `Purchase Total ${formatCurrency(totals.grandTotal)}`;
  }
}

function renderPurchaseSection() {
  syncPurchaseForm();
  renderPurchaseItemsEditor();
  renderSavedPurchases();
  renderPurchasePreview();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function rerenderApp() {
  if (!appState.currentInvoice.invoiceNo) {
    assignNextInvoiceNumber();
  }
  persistState();
  renderCustomerOptions();
  syncForm();
  renderPurchaseSection();
  renderProductCatalog();
  updateProductEditorUi();
  renderCustomerCatalog();
  renderSavedInvoices();
  renderItemsEditor();
  renderPreview();
}

rerenderApp();
setActiveTab("billing");

if (sessionStorage.getItem(ACCESS_SESSION_KEY) === "ok") {
  hideAuthOverlay();
} else {
  showAuthOverlay();
}
