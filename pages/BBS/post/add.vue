<template>
	<view class="container">
		<input v-model="form.title" class="title-input" placeholder="标题" />
		<textarea placeholder="说些什么叭...(不超过400字)" :auto-height="true" maxlength="-1" v-model="form.content"
			class="content-display"></textarea>
		<!-- 上传图片 -->
		<block v-if="form.type == 1">
			<text class="txt">最多选4张图片，每张不超过3MB</text>
			<u-upload :header=" { accessToken: storage.getAccessToken() }" :show-progress="false" :max-count="4" :max-size="3 * 1024 * 1024"
				:action="action" @on-uploaded="onUploaded" @on-remove="onRemove" :fileList="imageList"></u-upload>
		</block>
		<!-- 分类 -->
		<view @click="chooseClass" class="choose-item">
			<u-icon class="icon add-icon" name="file-text-fill" color="#999" size="40"></u-icon>
			<text class="txt">{{ cateName || '选择帖子分类' }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</view>
		<view class="button-style">
			<u-button v-if="form.type == 1" :custom-style="btnStyle" @click="submit" shape="circle">发布</u-button>
		</view>
	</view>
</template>

<script>
	import storage from "@/utils/storage.js";
	import {
		addPost,
		updatePost
	} from "@/api/bbs";
	import {
		upload
	} from "@/api/common.js";
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
				action: upload, //图片上传地址
				storage,
				form: {
					title: '',
					type: 1,
					topicId: 2,
					discussId: '',
					content: '',
					media: [],
					longitude: 0,
					latitude: 0,
					address: '',
					cut: [], //分类id
					pay: '',
				},
				cateName: '',
				imageList: [],
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
		    
		    // 如果存在id参数，表示当前是编辑地址，需要查询地址详情信息
		    if (option.id) {
		        // 调用postDetail方法查询地址详情
		        postDetail(option.id).then((res) => {
		            // 如果返回的数据code为0，表示查询成功
		            if (res.data.code === 0) {
		                const params = res.data.result;
		                // 使用Vue.set方法将查询到的地址详情赋值给form属性
		                this.$set(this, "form", params);
		                this.cateName = params.cutName.toString();
		                // 遍历form.media数组，并将每个元素封装成包含url属性的对象，然后添加到imageList数组中
		                this.form.media.forEach((item) => {
		                    let image = {
		                        url: item
		                    }
		                    this.imageList.push(image);
		                })
		            }
		        });
		    }
		    
		    // 隐藏加载中的提示框
		    uni.hideLoading();
		},

		methods: {
			chooseClass() {
				uni.navigateTo({
					url: "category?cateList=" + JSON.stringify(this.form.cut)
				})
			},
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




			submit() {
				if (!this.form.content) {
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
				console.log(this.form.id)
				if (this.form.id) {

					uni.showModal({
						title: "确认修改",
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
						title: "确认发布",
						content: "您确认要发布该帖子吗?",
						loading: true,
						success: function(res) {
							console.log(1);
							if (res.confirm) {
								uni.showLoading({
									mask: true,
									title: '发布中'
								});
								addPost(vm.form).then((res) => {
                  console.log("zc", JSON.parse(JSON.stringify(vm.form)))
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