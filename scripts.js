/**
 * المحاسب الشامل - ملف البرمجة الرئيسي
 */

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // تفعيل التلميحات
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // تفعيل المؤشرات
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
  
  // تفعيل وظائف خاصة بالصفحات
  initPageFunctions();
});

// تهيئة وظائف الصفحات
function initPageFunctions() {
  // صفحة تسجيل الدخول
  if (document.getElementById('loginForm')) {
    initLoginPage();
  }
  
  // صفحة الأصناف
  if (document.querySelector('.table-hover') && window.location.href.includes('items.html')) {
    initItemsPage();
  }
  
  // صفحة فواتير المبيعات
  if (document.querySelector('.table-hover') && window.location.href.includes('sales.html')) {
    initSalesPage();
  }
}

// وظائف صفحة تسجيل الدخول
function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // للعرض التوضيحي فقط، سنقوم بتسجيل الدخول مباشرة
    window.location.href = 'index.html';
  });
}

// وظائف صفحة الأصناف
function initItemsPage() {
  // إضافة صنف جديد
  const addItemBtn = document.querySelector('[data-bs-target="#addItemModal"]');
  if (addItemBtn) {
    addItemBtn.addEventListener('click', function() {
      // إعادة تعيين النموذج
      const form = document.querySelector('#addItemModal form');
      if (form) form.reset();
    });
  }
  
  // أزرار حذف الأصناف
  const deleteButtons = document.querySelectorAll('.btn-danger');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
        // هنا يتم حذف الصنف (للعرض التوضيحي فقط)
        alert('تم حذف الصنف بنجاح');
      }
    });
  });
}

// وظائف صفحة فواتير المبيعات
function initSalesPage() {
  // إضافة فاتورة جديدة
  const addInvoiceBtn = document.querySelector('[data-bs-target="#addInvoiceModal"]');
  if (addInvoiceBtn) {
    addInvoiceBtn.addEventListener('click', function() {
      // إعادة تعيين النموذج
      const form = document.querySelector('#addInvoiceModal form');
      if (form) form.reset();
      
      // تعيين تاريخ اليوم
      const dateInput = form.querySelector('input[type="date"]');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
      }
    });
  }
  
  // حساب إجماليات الفاتورة
  const quantityInputs = document.querySelectorAll('#invoiceItemsTable input[type="number"]');
  quantityInputs.forEach(input => {
    input.addEventListener('change', calculateInvoiceTotals);
  });
  
  // أزرار حذف الفواتير
  const deleteButtons = document.querySelectorAll('.btn-danger');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
        // هنا يتم حذف الفاتورة (للعرض التوضيحي فقط)
        alert('تم حذف الفاتورة بنجاح');
      }
    });
  });
  
  // إضافة صنف للفاتورة
  const addItemToInvoiceBtn = document.querySelector('#invoiceItemsTable tfoot button');
  if (addItemToInvoiceBtn) {
    addItemToInvoiceBtn.addEventListener('click', function() {
      const tbody = document.querySelector('#invoiceItemsTable tbody');
      const rowCount = tbody.querySelectorAll('tr').length;
      
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${rowCount + 1}</td>
        <td>
          <select class="form-select">
            <option selected disabled value="">اختر الصنف</option>
            <option>جهاز كمبيوتر</option>
            <option>طابعة</option>
            <option>ماوس</option>
            <option>كيبورد</option>
            <option>شاشة كمبيوتر</option>
          </select>
        </td>
        <td>قطعة</td>
        <td>
          <input type="number" class="form-control" value="1" min="1">
        </td>
        <td>
          <div class="input-group">
            <input type="number" class="form-control" value="0">
            <span class="input-group-text">ر.س</span>
          </div>
        </td>
        <td>0.00 ر.س</td>
        <td>
          <button type="button" class="btn btn-sm btn-danger">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      tbody.appendChild(newRow);
      
      // إضافة مستمع الحدث للحقول الجديدة
      const newQuantityInput = newRow.querySelector('input[type="number"]');
      newQuantityInput.addEventListener('change', calculateInvoiceTotals);
      
      const newDeleteButton = newRow.querySelector('.btn-danger');
      newDeleteButton.addEventListener('click', function() {
        newRow.remove();
        calculateInvoiceTotals();
      });
    });
  }
}

// حساب إجماليات الفاتورة
function calculateInvoiceTotals() {
  // للعرض التوضيحي فقط، سنستخدم قيم ثابتة
  const subtotal = 1800;
  const discount = 0;
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  // تحديث العرض
  const totalElements = document.querySelectorAll('.card-body strong');
  if (totalElements.length >= 3) {
    totalElements[0].textContent = subtotal.toFixed(2) + ' ر.س';
    totalElements[1].textContent = total.toFixed(2) + ' ر.س';
    totalElements[2].textContent = total.toFixed(2) + ' ر.س';
  }
}

// وظائف مساعدة
function formatCurrency(amount) {
  return amount.toFixed(2) + ' ر.س';
}

function formatDate(date) {
  const d = new Date(date);
  return d.getFullYear() + '/' + 
         String(d.getMonth() + 1).padStart(2, '0') + '/' + 
         String(d.getDate()).padStart(2, '0');
}
