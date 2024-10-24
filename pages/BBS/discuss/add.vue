<template>
	<view class="container">
		<input v-model="form.title" class="title-input" placeholder="话题标题" />
		<textarea placeholder="说说你想让大家讨论的话题叭...(不超过400字)" :auto-height="true" maxlength="-1" v-model="form.description"
			class="content-display"></textarea>
		<!-- 分类 -->
		<view @click="chooseClass" class="choose-item">
			<u-icon class="icon add-icon" name="file-text-fill" color="#999" size="40"></u-icon>
			<text class="txt">{{ cateName || '选择话题分类' }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</view>
		<view class="button-style">
			<u-button :custom-style="btnStyle" @click="submit" shape="circle">发布</u-button>
		</view>
	</view>
</template>

<script>
	import storage from "@/utils/storage.js";
	import {
		addDiscuss,
		discussDetail,
		updateDiscuss
	} from "@/api/bbs";
	import {
		postDetail
	} from "../../../api/bbs";
	export default {
		data() {
			return {
				btnStyle: {
					color: "#fff",
					backgroundColor: '#333333'
				},
				storage,
				form: {
					title: '',
					discussId: '',
					description: '',
					cut: [], //分类id
				},
				cateName: '',
				header: {
					token: uni.getStorageSync('token')
				},

			};
		},
		onLoad(option) {
		    // 显示加载中的提示框
		    uni.showLoading({
		        title: "加载中",
		    });
		    
		    // 将路由参数赋值给routerVal变量
		    this.routerVal = option;
		    
		    // 如果存在id参数，表示当前是修改话题，需要查询话题详情信息，不存在id则为发布话题
		    if (option.id) {
		        discussDetail(option.id).then((res) => {
		            if (res.data.code === 0) {
		                const params = res.data.result;
		                this.$set(this, "form", params);
		                this.cateName = params.cutName.toString();
		            }
		        });
		    }
		    
		    // 隐藏加载中的提示框
		    uni.hideLoading();
		},

		methods: {
			chooseClass() {
				uni.navigateTo({
					url: "/pages/BBS/post/category?cateList=" + JSON.stringify(this.form.cut)
				})
			},
			
			submit() {
				if (!this.form.description) {
					this.$u.toast('内容不能为空');
					return;
				}
				if (!this.form.title) {
					this.$u.toast('标题不能为空');
					return;
				}

				if (this.form.cut.length === 0) {
					this.$u.toast('分类不能为空');
					return;
				}


				let vm = this;
				if (this.form.id) {

					uni.showModal({
						title: "提示",
						content: "您确认要修改吗?",
						loading: true,
						success: function(res) {
							console.log(1);
							if (res.confirm) {
								uni.showLoading({
									mask: true,
									title: '修改中'
								});
								updateDiscuss(vm.form).then((res) => {
									if (res.data.code === 0) {
										uni.redirectTo({
											url: '/pages/BBS/discuss/discuss?id=' + res.data.result
										});
									}
									uni.hideLoading();
								});
							}
						}
					});
				} else {
					uni.showModal({
						title: "提示",
						content: "您确认要发布该话题吗?",
						loading: true,
						success: function(res) {
							console.log(1);
							if (res.confirm) {
								uni.showLoading({
									mask: true,
									title: '发布中'
								});
								addDiscuss(vm.form).then((res) => {
									if (res.data.code === 0) {
										uni.redirectTo({
											url: '/pages/BBS/discuss/discuss?id=' + res.data.result
										});
									}
									uni.hideLoading();
								});
							}
						}
					});

				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.title-input {
		border-bottom: 1px solid #F5F5F5;
		margin: 20rpx 0;
		padding: 20rpx 0;
	}

	.content-display {
		width: 100%;
		padding: 20rpx 0;
		min-height: 300rpx;
	}

	.choose-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1px solid #F5F5F5;

		&:last-child {
			border: 0;
		}

		.txt {
			margin-left: 20rpx;
		}

		.sw {
			margin-left: 300rpx;
		}

		.inputStyle {
			margin-left: 60rpx;
			width: 400rpx;
		}

		.radio {
			margin-left: 320rpx;
		}

		.icon {
			width: 40rpx;
			height: 40rpx;
		}

		.u-icon {
			margin-left: auto;
			color: #999;
		}

		.add-icon {
			margin-left: 0;
		}
	}

	.button-style {
		margin-top: 50rpx;
		color: #F4F4F5;
	}
</style>