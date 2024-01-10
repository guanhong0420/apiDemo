const api_path = "guanhong420-api";
const token = "nEY3yvtklmT83uioJE4fQgo6dfF2";
const apiUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}`;
let productList = []; // 產品列表
let cartData = [];  // 購物車列表

function getProductList() {
  axios
    .get(`${apiUrl}/products`)
    .then(function (res) {
      productList = res.data.products;
      renderProductList(productList);
    })
    .catch(function (err) {
      console.log(err);
    });
}


const productWrap = document.querySelector('.productWrap'); // 預期渲染產品列表的位置
function renderProductList(data) {
  let str = '';
  data.forEach(function (item) {
    str += `
            <li class="productCard">
              <h4 class="productType">新品</h4>
              <img src=${item.images} alt="" />
              <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
              <h3>${item.title}</h3>
              <del class="originPrice">NT${item.origin_price}</del>
              <p class="nowPrice">NT${item.price}</p>
            </li>
        `;
  });
  productWrap.innerHTML = str;
}


const productSelect = document.querySelector('.productSelect');
productSelect.addEventListener('change', function (e) {
  let category = e.target.value;
  if (category == '全部') {
    renderProductList(productList);
    return;
  }
  let str = '';
  productList.forEach(function (item) {
    if (item.category == category) {
      str += `
      <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src=${item.images} alt="" />
        <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT${item.origin_price}</del>
        <p class="nowPrice">NT${item.price}</p>
      </li>
  `;
    }
  });
  productWrap.innerHTML = str;
})


productWrap.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.nodeName !== 'A') {
    return;
  }
  let productId = e.target.getAttribute('data-id');
  let addData = {
    data: {
      productId: productId,
      quantity: 1
    }
  }
  axios
    .post(`${apiUrl}/carts`, addData)
    .then(function (res) {
      cartData = res.data.carts;
      renderCartList(cartData);
    })
    .catch(function (err) {
      console.log(err);
    });
})


const cartList = document.querySelector('.shoppingCart-tableList');
const totalPrice = document.querySelector('.totalPrice');
function renderCartList(data) {
  let str = '';
  data.forEach(function (item) {
    str += `
          <tr>
            <td>
              <div class="cardItem-title">
                <img src="${item.product.images}" alt="${item.product.title}" />
                <p>${item.product.title}</p>
              </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td>
              <div class="d-flex align-items-center gap-3" style="margin-left: -12px;">
                <div class="updateBtn">
                  <a href="#" class="material-icons" id="removeBtn" style="font-size: 24px;">  </a>
                </div>
                ${item.quantity}
                <div class="updateBtn">
                  <a href="#" class="material-icons" id="addBtn" style="font-size: 24px;">  </a>
                </div>
              </div>
            </td>
            <td>NT$${item.product.price * item.quantity}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons" data-id="${item.id}"> x </a>
            </td>
          </tr>`;
  });
  let num = 0;
  data.forEach(function (item) {
    num += item.product.price;
    return
  })
  cartList.innerHTML = str;
  totalPrice.textContent = `NT$${num}`;
}


function getCartList() {
  axios
    .get(`${apiUrl}/carts`)
    .then(function (res) {
      cartData = res.data.carts;
      renderCartList(cartData);
    })
    .catch(function (err) {
      console.log(err);
    });
}

cartList.addEventListener('click', function (e) {
  e.preventDefault();
  const cartId = e.target.getAttribute('data-id');
  if (cartId === null) {
    return;
  }
  axios
    .delete(`${apiUrl}/carts/${cartId}`)
    .then(function (res) {
      cartData = res.data.carts;
      renderCartList(cartData);
    })
    .catch(function (err) {
      console.log(err);
    });
})


const deleteAllCartBtn = document.querySelector('.discardAllBtn');
function deleteAllCartList() {
  axios.delete(`${apiUrl}/carts`)
    .then(function (res) {
      cartData = res.data.carts;
      renderCartList(cartData);
    })
    .catch(function (err) {
      console.log(err);
    })
}
deleteAllCartBtn.addEventListener('click', function () {
  deleteAllCartList();
})


const orderInfoForm = document.querySelector('.orderInfo-form');
const orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (cartData.length === 0) {
    alert('購物車沒有產品！');
    return;
  }
  const customerName = document.querySelector('#customerName').value;
  const customerPhone = document.querySelector('#customerPhone').value;
  const customerEmail = document.querySelector('#customerEmail').value;
  const customerAddress = document.querySelector('#customerAddress').value;
  const customerTradeWay = document.querySelector('#tradeWay').value;
  if (customerName === '' || customerPhone === '' || customerEmail === '' || customerAddress === '' || customerTradeWay === '') {
    alert('內容不可為空！');
    return;
  }
  const formData = {
    data: {
      user: {
        name: customerName,
        tel: customerPhone,
        email: customerEmail,
        address: customerAddress,
        payment: customerTradeWay
      }
    }
  }
  axios
    .post(`${apiUrl}/orders`, formData)
    .then(function (res) {
      alert("訂單建立成功!");
      orderInfoForm.reset();
      getCartList();
    })
    .catch(function (err) {
      console.log(err);
    });
})


function init() {
  getProductList();
  getCartList();
}
init();