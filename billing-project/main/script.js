
// Load data from localStorage
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
let payments = JSON.parse(localStorage.getItem('payments')) || [];
// DOM elements
const customersBtn = document.getElementById('customers-btn');
const invoicesBtn = document.getElementById('invoices-btn');
const paymentsBtn = document.getElementById('payments-btn');
const reportsBtn = document.getElementById('reports-btn');
const customersSection = document.getElementById('customers-section');
const invoicesSection = document.getElementById('invoices-section');
const paymentsSection = document.getElementById('payments-section');
const reportsSection = document.getElementById('reports-section');
const customerForm = document.getElementById('customer-form');
const invoiceForm = document.getElementById('invoice-form');
const paymentForm = document.getElementById('payment-form');
const customerList = document.getElementById('customer-list');
const invoiceList = document.getElementById('invoice-list');
const paymentList = document.getElementById('payment-list');
const totalInvoices = document.getElementById('total-invoices');
const totalPayments = document.getElementById('total-payments');
const outstandingBalance = document.getElementById('outstanding-balance');
// Navigation
customersBtn.addEventListener('click', () => showSection(customersSection));
invoicesBtn.addEventListener('click', () => showSection(invoicesSection));
paymentsBtn.addEventListener('click', () => showSection(paymentsSection));
reportsBtn.addEventListener('click', () => showSection(reportsSection));
function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    section.classList.remove('hidden');
}
// Customer management
customerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    // Check if customer with same name exists
    if (customers.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert('Customer with this name already exists.');
        return;
    }
    customers.push({ id: Date.now(), name, email });
    localStorage.setItem('customers', JSON.stringify(customers));
    updateCustomerList();
    updateCustomerSelect();
    customerForm.reset();
});
function updateCustomerList() {
    customerList.innerHTML = customers.map(customer => `<li>${customer.name} - ${customer.email}</li>`).join('');
}
function updateCustomerSelect() {
    const select = document.getElementById('invoice-customer');
    select.innerHTML = '<option value="">Select Customer</option>' + customers.map(customer => `<option value="${customer.id}">${customer.name}</option>`).join('');
}
// Invoice generation
invoiceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const customerId = document.getElementById('invoice-customer').value;
    const amount = parseFloat(document.getElementById('invoice-amount').value);
    const description = document.getElementById('invoice-description').value;
    const customer = customers.find(c => c.id == customerId);
    // Prevent duplicate invoice for same customer with same description
    if (invoices.some(inv => inv.customer === customer.name && inv.description === description)) {
        alert('Invoice for this customer with the same description already exists.');
        return;
    }
    invoices.push({ id: Date.now(), customer: customer.name, amount, description, paid: 0 });
    localStorage.setItem('invoices', JSON.stringify(invoices));
    updateInvoiceList();
    updateInvoiceSelect();
    updateReports();
    invoiceForm.reset();
});
function updateInvoiceList() {
    invoiceList.innerHTML = invoices.map(invoice => `<li>${invoice.customer} - $${invoice.amount} - ${invoice.description} (Paid: $${invoice.paid})</li>`).join('');
}
function updateInvoiceSelect() {
    const select = document.getElementById('payment-invoice');
    select.innerHTML = '<option value="">Select Invoice</option>' + invoices.map(invoice => `<option value="${invoice.id}">${invoice.customer} - $${invoice.amount}</option>`).join('');
}
// Payment tracking
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const invoiceId = document.getElementById('payment-invoice').value;
    const amount = parseFloat(document.getElementById('payment-amount').value);
    const date = document.getElementById('payment-date').value;
    const invoice = invoices.find(inv => inv.id == invoiceId);
    if (invoice) {
        invoice.paid += amount;
        payments.push({ id: Date.now(), invoiceId, amount, date });
        localStorage.setItem('invoices', JSON.stringify(invoices));
        localStorage.setItem('payments', JSON.stringify(payments));
        updatePaymentList();
        updateInvoiceList();
        updateReports();
        paymentForm.reset();
    }
});
function updatePaymentList() {
    paymentList.innerHTML = payments.map(payment => {
        const invoice = invoices.find(inv => inv.id == payment.invoiceId);
        return `<li>${invoice.customer} - $${payment.amount} on ${payment.date}</li>`;
    }).join('');
}
// Reports
function updateReports() {
    const totalInv = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPay = payments.reduce((sum, pay) => sum + pay.amount, 0);
    const outstanding = totalInv - totalPay;
    totalInvoices.textContent = totalInv.toFixed(2);
    totalPayments.textContent = totalPay.toFixed(2);
    outstandingBalance.textContent = outstanding.toFixed(2);

    // Generate detailed invoice report rows
    const reportBody = document.getElementById('invoice-report-body');
    reportBody.innerHTML = '';

    invoices.forEach(invoice => {
        const dueAmount = invoice.amount - invoice.paid;
        const paymentStatus = dueAmount <= 0 ? 'Paid' : 'Pending';

        const statusClass = dueAmount <= 0 ? 'paid' : 'pending';
        const dueAmountDisplay = dueAmount > 0 ? `<span class="due">$${dueAmount.toFixed(2)}</span>` : '';

        const row = document.createElement('tr');

        const customerCell = document.createElement('td');
        customerCell.textContent = invoice.customer;

        const productCell = document.createElement('td');
        productCell.textContent = invoice.description || '-';

        const statusCell = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.textContent = paymentStatus;
        statusSpan.className = statusClass;
        statusCell.appendChild(statusSpan);

        const dueCell = document.createElement('td');
        dueCell.innerHTML = dueAmountDisplay;

        row.appendChild(customerCell);
        row.appendChild(productCell);
        row.appendChild(statusCell);
        row.appendChild(dueCell);

        reportBody.appendChild(row);
    });
}
const validUsername = "Shekhlabel@gmail.com";
const validPassword = "rouf";

const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const mainHeader = document.getElementById('main-header');
const mainContent = document.getElementById('main-content');
function showMainApp() {
    loginSection.style.display = 'none';
    mainHeader.style.display = 'block';
    mainContent.style.display = 'block';
}

function showLogin() {
    loginSection.style.display = 'flex';
    mainHeader.style.display = 'none';
    mainContent.style.display = 'none';
}

function checkLogin() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
        showMainApp();
    } else {
        showLogin();
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    usernameError.style.display = 'none';
    passwordError.style.display = 'none';
    if (usernameInput === validUsername && passwordInput === validPassword) {
        localStorage.setItem('loggedIn', 'true');
        showMainApp();
    } else if (usernameInput !== validUsername) {
        usernameError.textContent = 'Invalid username';
        usernameError.style.display = 'block';
    } else if (passwordInput !== validPassword) {
        passwordError.textContent = 'Invalid password';
        passwordError.style.display = 'block';
    }
});

// Clear login on page unload
window.addEventListener('beforeunload', () => {
    localStorage.removeItem('loggedIn');
});

// Initialize
checkLogin();
updateCustomerList();
updateCustomerSelect();
updateInvoiceList();
updateInvoiceSelect();
updatePaymentList();
updateReports();
