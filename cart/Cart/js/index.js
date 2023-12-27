class ShoppingCart {
	constructor(products) {
		this.cartItems = []; // 购物车中的商品列表
		this.products = products; // 所有产品信息
		this.init(); // 初始化购物车
	}

	init() {
		this.renderProductList(); // 渲染产品列表
		this.renderCart(); // 渲染购物车
	}

	addToCart(img, name, price, author, copy) {
		const item = this.cartItems.find(item => item.name === name); // 查找购物车中是否已经存在该商品
		if (item) {
			// 如果有增加这个商品的数量
			item.quantity++;
		} else {
			// 如果没有则将商品添加到购物车中
			this.cartItems.push({
				img, // 商品图片
				name, // 商品名称
				price, // 商品价格
				author, // 商品作者
				copy, // 商品简介
				quantity: 1, // 商品初始数量
				selected: false // 商品初始按钮选择
			});
		}
		this.renderCart(); // 更新购物车显示
	}

	removeFromCart(index) {
		this.cartItems.splice(index, 1); // 从购物车中移除指定索引的商品
		this.renderCart(); // 更新购物车显示
	}

	updateQuantity(index, quantity) {
		const item = this.cartItems[index];
		if (item) {
			item.quantity = quantity; // 更新指定索引商品的数量
			this.renderCart(); // 更新购物车显示
		}
	}

	toggleSelection(index) {
		const item = this.cartItems[index];
		if (item) {
			item.selected = !item.selected; // 切换指定索引商品的选中状态
			this.renderCart(); // 更新购物车显示
		}
	}

	toggleAllSelection() {
		const allSelected = this.cartItems.every(item => item.selected); // 判断是否所有商品都被选中
		this.cartItems.forEach(item => item.selected = !allSelected); // 切换所有商品的选中状态
		this.renderCart(); // 更新购物车显示
	}

	createElement(tag, config) {
		const element = document.createElement(tag); // 创建指定标签的元素
		for (const key in config) {
			if (key === 'textContent') {
				element.textContent = config[key]; // 设置元素的文本内容
			} else if (key === 'classList') {
				element.classList.add(...config[key]); // 添加元素的类名
			} else {
				element[key] = config[key]; // 设置元素的其他属性
			}
		}
		return element;
	}

	renderCart() {
		const cartElement = document.querySelector('#cart');
		cartElement.innerHTML = '';

		let totalPrice = 0;
		let selectedCount = 0;

		const fragment = document.createDocumentFragment();

		this.cartItems.forEach((item, index) => {
			const itemTotalPrice = item.price * item.quantity;
			if (item.selected) {
				totalPrice += itemTotalPrice;
				selectedCount++;
			}

			const itemElement = this.createElement('tr', {
				classList: ['cart-item']
			});

			const createCell = (tagName, options = {}) => {
				const cell = itemElement.appendChild(this.createElement(tagName, options));
				return cell;
			};

			const checkboxCell = createCell('td');
			const nameCell = createCell('td');
			const priceCell = createCell('td', {
				classList: ['cart-txt-left']
			});
			const quantityCell = createCell('td', {
				classList: ['cart-renudd', 'cart-numreduce']
			});
			const subtotalCell = createCell('td');
			const deleteCell = createCell('td');

			const checkbox = createCell('input', {
				classList: ['cart-check'],
				type: 'checkbox',
				checked: item.selected,
				onchange: () => this.toggleSelection(index)
			});

			const name = createCell('p', {
				classList: ['cart-name'],
				textContent: item.name
			});

			const price = createCell('p', {
				classList: ['cart-price'],
				textContent: `价格: ${(item.price).toFixed(2)}`
			});

			const reduceButton = createCell('span', {
				classList: ['cart-reduce'],
				textContent: '-',
				onclick: () => {
					const newQuantity = item.quantity - 1;
					if (newQuantity >= 1) {
						this.updateQuantity(index, newQuantity);
					} else {
						this.removeFromCart(index);
					}
				}
			});

			const quantity = createCell('span', {
				classList: ['cart-num'],
				value: item.quantity,
				textContent: item.quantity,
				onchange: (event) => this.updateQuantity(index, parseInt(event.target.value))
			});

			const addButton = createCell('span', {
				classList: ['cart-add'],
				textContent: '+',
				onclick: () => {
					const newQuantity = item.quantity + 1;
					this.updateQuantity(index, newQuantity);
				}
			});

			const subtotal = createCell('p', {
				classList: ['cart-subtotal'],
				textContent: `总价: ${itemTotalPrice.toFixed(2)}`
			});

			const deleteButton = createCell('span', {
				classList: ['cart-del'],
				textContent: '删除',
				onclick: () => this.removeFromCart(index)
			});

			if (item.quantity === 1) {
				reduceButton.style.display = 'none';
				quantityCell.classList.add('cart-numadd');
				quantityCell.classList.remove('cart-numreduce');
			} else {
				reduceButton.style.display = 'inline-block';
				quantityCell.classList.add('cart-numreduce');
				quantityCell.classList.remove('cart-numadd');
			}

			checkboxCell.appendChild(checkbox);
			nameCell.appendChild(name);
			priceCell.appendChild(price);
			quantityCell.appendChild(reduceButton);
			quantityCell.appendChild(quantity);
			quantityCell.appendChild(addButton);
			subtotalCell.appendChild(subtotal);
			deleteCell.appendChild(deleteButton);

			fragment.appendChild(itemElement);
		});

		cartElement.appendChild(fragment);

		const selectedCountElement = document.querySelector('.cart-total-num');
		const totalPriceElement = document.querySelector('#total');
		selectedCountElement.textContent = selectedCount.toFixed(2);
		totalPriceElement.textContent = totalPrice.toFixed(2);

		const selectAllCheckbox = document.querySelector('#cart-all');
		selectAllCheckbox.checked = this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
		selectAllCheckbox.onchange = () => this.toggleAllSelection();
	}



	renderProductList() {
		const productListElement = document.querySelector('.block-items'); // 获取产品列表元素
		productListElement.innerHTML = ''; // 清空产品列表内容

		const fragment = document.createDocumentFragment(); // 创建文档片段，用于批量添加元素

		this.products.forEach((product) => {
			const productElement = this.createElement('li', {
				classList: ['block-item']
			}); // 创建产品元素

			const productImageElement = productElement.appendChild(this.createElement('div', {
				classList: ['book-img', 'book-tag-801']
			}));
			productImageElement.appendChild(this.createElement('img', {
				src: product.img,
				alt: product.name
			}));

			const productInfoElement = productElement.appendChild(this.createElement('div', {
				classList: ['book-info']
			}));

			const productNameElement = productInfoElement.appendChild(this.createElement('h4', {
				classList: ['name']
			}));

			const productAuthorElement = productInfoElement.appendChild(this.createElement('div', {
				classList: ['author']
			}));

			productInfoElement.appendChild(this.createElement('p', {
				classList: ['intro'],
				textContent: product.copy
			}));

			const productPriceElement = productInfoElement.appendChild(this.createElement('span', {
				classList: ['paperback']
			}));

			productNameElement.appendChild(this.createElement('a', {
				href: '#',
				title: product.name,
				textContent: product.name
			}));

			productAuthorElement.appendChild(this.createElement('span', {
				textContent: product.author
			}));

			productPriceElement.appendChild(this.createElement('span', {
				classList: ['price'],
				textContent: `￥${product.price}`
			}));

			const addToCartButton = productPriceElement.appendChild(this.createElement('span', {
				classList: ['gwc']
			}));
			addToCartButton.appendChild(this.createElement('img', {
				src: "./images/gwc.jpg",
				onclick: () => this.addToCart(product.img, product.name, product.price, product
					.author, product.copy)
			}));
			// 将产品元素添加到文档片段中
			fragment.appendChild(productElement);
		});
		// 将文档片段添加到产品列表元素中
		productListElement.appendChild(fragment);
	}

}
document.querySelector(".cart-bottom-btn").addEventListener("click", () => {
	console.log("数量为：" + document.querySelector(".cart-total-num").textContent)
	console.log("价格为：" + document.querySelector("#total").textContent)
});

class Countdown {
	constructor() {
		this.day = document.querySelector("#d");
		this.hour = document.querySelector("#h");
		this.minute = document.querySelector("#m");
		this.second = document.querySelector("#s");
		this.inputTime = +new Date('2024-1-1 00:00:00');
	}

	formatTime(time) {
		return time < 10 ? '0' + time : time;
	}

	countDown() {
		const nowTime = +new Date();
		const times = (this.inputTime - nowTime) / 1000;

		let d = parseInt(times / 60 / 60 / 24);
		this.day.innerHTML = `${this.formatTime(d)}天`;

		let h = parseInt(times / 60 / 60 % 24);
		this.hour.innerHTML = `${this.formatTime(h)}时`;

		let m = parseInt(times / 60 % 60);
		this.minute.innerHTML = `${this.formatTime(m)}分`;

		let s = parseInt(times % 60);
		this.second.innerHTML = `${this.formatTime(s)}秒`;
	}

	start() {
		this.countDown();
		setInterval(() => {
			this.countDown();
		}, 1000);
	}
}

class BlockItem {
	constructor() {
		this.element = document.querySelector(".block-item");
		this.height = this.getElementHeight();
		this.length = products.length;
		this.multiplier = Math.floor((this.length - 1) / 3) + 1;
	}

	getElementHeight() {
		const computedStyle = getComputedStyle(this.element);
		const marginTop = parseFloat(computedStyle.marginTop);
		const marginBottom = parseFloat(computedStyle.marginBottom);
		return this.element.offsetHeight + marginTop + marginBottom;
	}

	setHeight() {
		const height = this.height * this.multiplier + 20;
		document.documentElement.style.setProperty(`--i`, `${height}px`);
	}

	init() {
		document.addEventListener('DOMContentLoaded', () => {
			this.setHeight();
		});
	}
}





// 假设有一个全局变量products，包含所有产品信息
const shoppingCart = new ShoppingCart(products); // 创建购物车实例
const countdown = new Countdown();
const blockItem = new BlockItem();
blockItem.init();
countdown.start();