<template>
	<view class="container">
		<!-- 回答的问题 -->
		<input v-model="form.title" class="title-input" :disabled="true" />

		<u-gap height="1" bg-color="#F5F5F5"></u-gap>

		<!-- 回答内容 -->
		<textarea placeholder="谈谈你对该问题的看法叭...(不超过400字)" :auto-height="true" maxlength="-1" v-model="form.content"
			class="content-display"></textarea>

		<text class="txt">最多选4张图片，每张不超过3MB</text>
		<u-upload :header=" { accessToken: storage.getAccessToken() }" :show-progress="false" :max-count="4"
			:max-size="3 * 1024 * 1024" :action="action" @on-uploaded="onUploaded" @on-remove="onRemove"
			:fileList="imageList"></u-upload>

		<view class="button-style">
			<u-button :custom-style="btnStyle" @click="submit" shape="circle">发布</u-button>
		</view>
	</view>
</template>

<script>
	import storage from "@/utils/storage.js";
	import {
		addPost,
		updatePost,
		addDiscuss,
		discussDetail,
		updateDiscuss
	} from "@/api/bbs";
	import {
		postDetail
	} from "../../../api/bbs";
	import {
		upload
	} from "@/api/common.js";
	
	export default {
		data() {
			return {
				btnStyle: {
					color: "#fff",
					backgroundColor: '#333333'
				},
				action: upload, //图片上传地址
				storage,
				form: {
					title: '', //回答标题
					topicId: 0,
					type: 1,
					media: [],
					longitude: 0,
					latitude: 0,
					address: '',
					discussId: 0,
					content: '', //回答内容
					cut: [],
				},
				cateName: '',
				header: {
					token: uni.getStorageSync('token')
				},
				imageList: [],

			};
		},
		onLoad(option) {
			// 显示加载中的提示框
			uni.showLoading({
				title: "加载中",
			});

			// 将路由参数赋值给routerVal变量
			this.routerVal = option;

			this.form.title = option.title;
			this.form.discussId = option.discussId;

			// 隐藏加载中的提示框
			uni.hideLoading();
		},

		methods: {
			
			//图片上传
			onUploaded(lists) {
				let images = [];
			
				lists.forEach((item) => {
					if (item.response.result) {
						images.push(item.response.result)
					} else {
						images.push(item.url);
					}
				});
				this.form.media = images;
			},
			//图片删除
			onRemove(index, lists) {
				let images = [];
			
				lists.forEach((item) => {
					images.push(item.url);
				});
				this.form.media = images;
			
			},
			
			// 发表回答
			submit() {
				if (!this.form.content) {
					this.$u.toast('内容不能为空');
					return;
				}
				if (!this.form.title) {
					this.$u.toast('标题不能为空');
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
								updatePost(vm.form).then((res) => {
									if (res.data.code === 0) {
										uni.redirectTo({
											url: '/pages/BBS/post/post?id=' + res.data.result
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
						content: "您确认要发表该回答吗?",
						loading: true,
						success: function(res) {
							console.log(1);
							if (res.confirm) {
								uni.showLoading({
									mask: true,
									title: '发布中'
								});
								addPost(vm.form).then((res) => {
									if (res.data.code === 0) {
										uni.redirectTo({
											url: '/pages/BBS/post/post?id=' + res.data.result
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
		font-size: 22;
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