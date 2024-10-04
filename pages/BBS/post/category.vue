<template>
	<view class="container">
		<view class="title">选择圈子类目</view>
		<view class="class-wrap">
			<view v-for="(item, index) in classList" :key="index" :class="item.selected?'sort-active':'class-item'"
				@click="chooseClass(item,item.cateId,item.cateName)">{{ item.cateName }}
			</view>
		</view>
		<view class="sort-btn mp-iphonex-bottom">
			<view class="sort-btn-repick" @click="repick">重置</view>
			<view class="sort-btn-confim" @click="sortConfim">确定</view>
		</view>
	</view>
</template>

<script>
	import {
		classList
	} from "@/api/bbs";
	export default {
		data() {
			return {
				classList: [],
				selectedCateId: [],
				num: 0,
				selectedName: [],
				editCateIdList: []
			};
		},
		created() {
			this.getClassList();
		},
		onLoad(param) {
			this.editCateIdList = JSON.parse(param.cateList)
			this.num = this.editCateIdList.length;

		},
		methods: {
			getClassList() {
				classList().then((res) => {

					this.classList = res.data.result
					this.classList = this.classList.map(item => ({
						cateId: item.cateId,
						cateName: item.cateName,
						selected: this.editCateIdList.indexOf(item.cateId) > -1
					}));
				});
			},
			chooseClass(item) {
				if (this.num === 3 && !item.selected) {
					this.$u.toast('最多选取3个词条');
					return;
				}
				if (item.selected) {
					this.num--;
				} else {
					this.num++;
				}
				item.selected = !item.selected;
			},
			sortConfim() {
				let pages = getCurrentPages();
				let nowPage = pages[pages.length - 1];
				let prevPage = pages[pages.length - 2];
				this.classList.forEach((item) => {
					if (item.selected) {
						this.selectedCateId.push(item.cateId);
						this.selectedName.push(item.cateName)
					}
				});
				prevPage.$vm.form.cut = this.selectedCateId;
				console.log(prevPage.$vm.form.cut)
				prevPage.$vm.cateName = this.selectedName.toString();
				uni.navigateBack();
			},
			repick() {
				this.classList.forEach((item) => {
					item.selected = false;
				});
				this.num = 0;
			}

		}
	};
</script>

<style lang="scss" scoped>
	.title {
		margin-bottom: 30rpx;
	}


	.class-wrap {
		.class-item {
			width: 30%;
			display: inline-block;
			border: 1px solid #999;
			padding: 20rpx;
			font-size: 24rpx;
			color: #999;
			text-align: center;
			margin-bottom: 20rpx;
			border-radius: 10rpx;

			&:nth-child(3n + 2) {
				margin-left: 5%;
				margin-right: 5%;
			}


			&:active {
				background-color: #333;
				color: #fff;
			}
		}

		.sort-active {
			width: 30%;
			display: inline-block;
			border: 1px solid #999;
			padding: 20rpx;
			font-size: 24rpx;
			background-color: #333;
			color: #fff;
			text-align: center;
			margin-bottom: 20rpx;
			border-radius: 10rpx;

			&:nth-child(3n + 2) {
				margin-left: 5%;
				margin-right: 5%;
			}


			&:active {
				background-color: #333;
				color: #fff;
			}
		}
	}

	.sort-btn {
		display: flex;
		position: fixed;
		bottom: 0;
		border-top: 1px solid #f7f7f7;
		height: 100rpx;
		left: 0;
		width: 100%;
		background: #fff;
		align-items: center;

		>view {
			width: 50%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin: 0 20rpx;
			border-radius: 1000px;
		}

		>.sort-btn-repick {
			border: 1px solid #ededed;
		}

		>.sort-btn-confim {
			color: #fff;
			background-image: linear-gradient(90deg, #ff6b35, #ff9f28, #ffcc03);
		}
	}
</style>