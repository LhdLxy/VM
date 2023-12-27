// 商品对象
const products = [{
	img: "./images/book1.jpg",
	name: "新时代大学生劳动教育（微...",
	price: 54.00,
	author: "陈林辉，马芸，刘晓芳",
	copy: "本书是为落实德智体美劳全..."
}, {
	img: "./images/book1.jpg",
	name: "新时代大学生劳动教育（微...",
	price: 54.00,
	author: "陈林辉，马芸，刘晓芳",
	copy: "本书是为落实德智体美劳全..."
}];
// 购物车对象
const cartItems = [];
// 购物类
class ShoppingCart {
	// 实例化
	constructor(products) {
		this.cartItems = []; // 实例化购物车对象
		this.products = products; // 实例化商品对象
		this.init(); // 实例化渲染页面
	};
	
	// 调用初始渲染
	init() {
		this.renderProductList(); // 产品信息渲染
		this.renderCart(); // 购物车渲染
	};
	
	// 购物车函数
	addToCart(img, name, price, author, copy) {
		// 查询购物车对象
		const item = this.cartItems.find(item => item.name === name);
		// 判断购物车中是否有添加的这个商品，如果有在购物车的那个商品上增加一个数量，如果没有将商品添加到购物车
		if (item) {
			item.quantity++; // 增加这个商品的数量
		} else {
			this.cartItems.push({
				img, // 商品图片
				name, // 商品名称
				price, // 商品价格
				author, // 商品作者
				copy, // 商品简介
				quantity: 1, // 商品初始数量
				selected: false // 初始复选框按钮
			});
		}
		// 重新渲染购物车
		this.renderCart();
	};
	
	// 删除按钮事件
	removeFromCart(index) {
		this.cartItems.splice(index, 1); // 从购物车中移除指定索引的商品
		this.renderCart(); // 重新渲染购物车
	};
	
	// 购物车数量事件
	updateQuantity(index, quantity) {
		const item = this.cartItems[index];
		if (item) {
			item.quantity = quantity; // 更新购物车中商品的数量
			this.renderCart(); // 重新渲染购物车
		}
	};
	
	// 商品复选框事件
	toggleSelection(index) {
		const item = this.cartItems[index];
		if (item) {
			item.selected = !item.selected;
			this.renderCart(); // 重新渲染购物车
		}
	};
	
	// 全选复选框事件
	toggleAllSelection() {
		const allSelected = this.cartItems.every(item => item.selected); // 判断是否所有商品是否选中
		this.cartItems.forEach(item => item.selected = !allSelected); // 切换所有商品的选中状态
		this.renderCart(); // 重新渲染购物车
	};
	
	// 渲染购物车
	renderCart() {
		const cartElement = $('#cart');
		cartElement.empty(); // 清空购物车
	
	
		let totalPrice = 0; // 所有被选中的商品的总价
		let selectedCount = 0; // 所有被选中的商品的数量
	
		const fragment = $(document.createDocumentFragment()); // 创建一个空白模板
	
		// 循环购物车对象(item: 每个商品; index: 商品下标)
		this.cartItems.forEach((item, index) => {
			const itemTotalPrice = item.price * item.quantity;
			if (item.selected) {
				totalPrice += itemTotalPrice;
				selectedCount++;
			}
	
			// 创建初始渲染元素
			const itemElement = $('<tr>').addClass('cart-item');
			const checkboxCell = $('<td>');
			const nameCell = $('<td>');
			const priceCell = $('<td>').addClass('cart-txt-left');
			const quantityCell = $('<td>').addClass('cart-renudd cart-numreduce');
			const subtotalCell = $('<td>');
			const deleteCell = $('<td>');
	
	
			// 商品复选框按钮
			const checkbox = $('<input>').addClass('cart-check').attr({
				type: 'checkbox',
				checked: item.selected
			}).on('change', () => this.toggleSelection(index));
			// 商品名称
			const name = $('<p>').addClass('cart-name').text(item.name);
			// 商品的价格
			const price = $('<p>').addClass('cart-price').text(`价格: ${(item.price).toFixed(2)}`);
			// 商品减少按钮
			const reduceButton = $('<span>').addClass('cart-reduce').text('-').on('click', () => {
				const newQuantity = item.quantity - 1;
				if (newQuantity >= 1) {
					this.updateQuantity(index, newQuantity);
				} else {
					this.removeFromCart(index);
				}
			});
			// 商品数量
			const quantity = $('<span>').addClass('cart-num').attr({
				value: item.quantity
			}).text(item.quantity).on('change', (event) => this.updateQuantity(index, parseInt(event
				.target.value)));
			// 商品增加按钮
			const addButton = $('<span>').addClass('cart-add').text('+').on('click', () => {
				const newQuantity = item.quantity + 1;
				this.updateQuantity(index, newQuantity);
			});
			// 商品的小计
			const subtotal = $('<p>').addClass('cart-subtotal').text(`总价: ${itemTotalPrice.toFixed(2)}`);
			// 商品的删除按钮
			const deleteButton = $('<span>').addClass('cart-del').text('删除').on('click', () => this.removeFromCart(index));
			
			// 商品数量事件
			if (item.quantity === 1) {
				reduceButton.hide(); // 隐藏减号按钮
				quantityCell.addClass('cart-numadd').removeClass('cart-numreduce');
			} else {
				reduceButton.show(); // 显示减号按钮
				quantityCell.addClass('cart-numreduce').removeClass('cart-numadd');
			}
			
			// 追加元素
			checkboxCell.append(checkbox);
			nameCell.append(name);
			priceCell.append(price);
			quantityCell.append(reduceButton).append(quantity).append(addButton);
			subtotalCell.append(subtotal);
			deleteCell.append(deleteButton);
			
			// 将所有商品添加到<tr>上面
			itemElement.append(checkboxCell).append(nameCell).append(priceCell).append(quantityCell).append(
				subtotalCell).append(deleteCell);
	
			fragment.append(itemElement);
		});
	
		cartElement.append(fragment);
	
		const selectedCountElement = $('.cart-total-num');
		const totalPriceElement = $('#total');
		
		// 显示商品的数量和总价钱
		selectedCountElement.text(selectedCount.toFixed(2));
		totalPriceElement.text(totalPrice.toFixed(2));
	
		// 复选框事件处理
		const selectAllCheckbox = $('#cart-all'); // 全选复选框
		selectAllCheckbox.prop('checked', this.cartItems.length > 0 && this.cartItems.every(item => item.selected));
		selectAllCheckbox.on('change', () => this.toggleAllSelection()); // 点击全选按钮执行
	}
	
	// 渲染产品列表
	renderProductList() {
		const productListElement = $('.block-items'); // 获取产品列表元素
		productListElement.empty(); // 清空产品列表内容

		const fragment = $(document.createDocumentFragment()); // 创建文档片段，用于批量添加元素

		this.products.forEach((product) => {
			const productElement = $('<li>').addClass('block-item'); // 创建产品元素
			// 所有外部元素
			const productImageElement = $('<div>').addClass('book-img book-tag-801'); //图片
			const productNameElement = $('<h4>').addClass('name'); // 名称
			const productAuthorElement = $('<div>').addClass('author'); //作者
			const productInfoElement = $('<div>').addClass('book-info'); // 包含名称、作者、简介
			const addToCartButton = $('<span>').addClass('gwc'); //购物车按钮
			const productPriceElement = $('<span>').addClass('paperback'); // 包含价格和购物车按钮
			// 商品图片
			productImageElement.append($('<img>').attr({ src: product.img, alt: product.name }));
			// 商品名称
			productNameElement.append($('<a>').attr({ href: '#', title: product.name }).text(product.name));
			// 商品作者
			productAuthorElement.append($('<span>').text(product.author));
			// 商品简介
			const peoductDshorElement = $('<p>').addClass('intro').text(product.copy)
			// 商品价格
			productPriceElement.append($('<span>').addClass('price').text(`￥${product.price}`));
			// 创建添加到购物车按钮
			addToCartButton.append($('<img>').attr({src: './images/gwc.jpg'}).on("click", () => this.addToCart(product.img, product.name, product.price, product.author, product.copy)));			
			productPriceElement.append(addToCartButton);
			
			
			// 将产品元素添加到文档片段中
			fragment.append(productElement.append(productImageElement,productInfoElement.append(productNameElement,productAuthorElement,peoductDshorElement,productPriceElement)));
		});

		// 将文档片段添加到产品列表元素中
		productListElement.append(fragment);
	}
}
class Countdown{constructor(){this.day=$("#d");this.hour=$("#h");this.minute=$("#m");this.second=$("#s");this.inputTime=+new Date('2024-1-1 00:00:00');};formatTime(time){return time<10?'0'+time:time};start(){setInterval(()=>{this.day.html(`${this.formatTime(parseInt((this.inputTime-+new Date())/1000/60/60/24))}天`);this.hour.html(`${this.formatTime(parseInt((this.inputTime-+new Date())/1000/60/60%24))}时`);this.minute.html(`${this.formatTime(parseInt((this.inputTime-+new Date())/1000/60%60))}分`);this.second.html(`${this.formatTime(parseInt((this.inputTime-+new Date())/1000%60))}秒`);},1000);};};
class BlockItem {constructor(){this.element=$('.block-item');this.height=this.getElementHeight();this.length=products.length;this.multiplier=Math.floor((this.length-1)/3)+1;};getElementHeight(){return this.element.outerHeight()+parseFloat(this.element.css('marginTop'))+parseFloat(this.element.css('marginBottom'))};setHeight(){$('html').css('--i',`${this.height*this.multiplier+20}px`)};init(){$(document).ready(()=>this.setHeight())};};
new ShoppingCart(products);new Countdown().start();new BlockItem().init();