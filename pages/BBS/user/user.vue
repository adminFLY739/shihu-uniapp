<template>
	<view>
		<view class="head">

			<u-grid :col="3" :border="false" style="margin: 20rpx 0;" @click="toNav">
				<u-grid-item index="/pages/BBS/my/user?type=2">
					<text>{{ userInfo.fans || 0}}</text>
					<view class="grid-text">粉丝</view>
				</u-grid-item>
				<u-grid-item index="/pages/BBS/my/user?type=1">
					<text>{{ userInfo.follow || 0 }}</text>
					<view class="grid-text">关注</view>
				</u-grid-item>
				<u-grid-item index="/pages/BBS/my/post?type=2">
					<text>{{ userInfo.postNum || 0 }}</text>
					<view class="grid-text">帖子</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 我的服务 -->
		<view class="block-wrap">
			<view class="block-title">我的服务</view>
			<u-grid :col="4" :border="false" style="margin: 20rpx 0;" @click="toNav">

				<u-grid-item index="/pages/BBS/my/post?type=2">
					<image class="gn-icon" src="/static/img/post.png"></image>
					<view class="grid-text">我的帖子</view>
				</u-grid-item>

				<u-grid-item index="/pages/BBS/my/post?type=1">
					<image class="gn-icon" src="/static/img/star.png"></image>
					<view class="grid-text">我的收藏</view>
				</u-grid-item>

				<u-grid-item index="/pages/BBS/my/user?type=1">
					<image class="gn-icon" src="/static/img/watch.png"></image>
					<view class="grid-text">我的关注</view>
				</u-grid-item>

				<u-grid-item index="/pages/BBS/my/user?type=2">
					<image class="gn-icon" src="/static/img/fans.png"></image>
					<view class="grid-text">我的粉丝</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 发贴入口 -->
		<add-post-tag></add-post-tag>
	</view>
</template>

<script>
	import addPostTag from '@/components/add-post-tag/add-post-tag.vue';
	import storage from "@/utils/storage.js";
	import {
		userInfo
	} from "@/api/bbs";
	export default {
		components: {
			addPostTag
		},
		data() {
			return {
				userInfo: '',
				hasLogin: false,
				storage
			};
		},
		onLoad() {
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			//#endif
		},
		onShow() {
			if (storage.getAutoCp() && storage.getAutoCp() != '' && storage.getAutoCp() != undefined && storage
			.getAutoCp() != null) {
				this.hasLogin = false;
			} else {
				this.getUserInfo();
				this.hasLogin = true;
			}
		},
		onShareAppMessage(res) {
			let imgURL = 'http://pic.linfeng.tech/logo.png';
			return {
				title: this.$c.miniappName,
				path: '/pages/index/index',
				imageUrl: imgURL
			};
		},
		methods: {
			getUserInfo() {

				userInfo().then(res => {
					this.userInfo = res.data.result;
				});
			},
			goUser() {
				uni.navigateTo({
					url: '/pages/user/edit'
				});
			},
			toNav(url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	};
</script>

<style>
	page {
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.head {
		padding: 20rpx;
		background-color: #fff;

		.sub-txt {
			font-size: 24rpx;
			color: #616161;
			display: block;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}

		margin-bottom: 20rpx;
	}

	.userinfo {
		display: flex;
		align-items: center;
		padding: 20rpx;
	}

	.userinfo .username {
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.grid-text {
		color: #999;
		font-size: 12px;
		margin-bottom: 20rpx;
	}

	.userinfo u-avatar {
		margin-right: 20rpx;
	}

	.userinfo .arrow-right {
		margin-left: auto;
	}

	.btn-login {
		margin: 40rpx 0;
	}

	.gn-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 20rpx;
	}

	/*服务按钮*/
	.btn-wrap {
		display: flex;
		margin-top: 30rpx;
	}

	.btn-wrap .btn-contact {
		background-color: #fff;
		margin-left: 15rpx;
		margin-right: 15rpx;
		padding: 20rpx;
		line-height: unset;
		font-size: 12px;
		color: #999;
	}

	.btn-wrap .btn-contact:active {
		background-color: #f5f5f5;
	}

	.btn-wrap .btn-contact .txt {
		margin-top: 20rpx;
	}

	.btn-wrap .btn-contact::after {
		border: unset;
		position: unset;
	}

	.icon-size {
		font-size: 50rpx;
	}

	.block-wrap {
		background-color: #fff;
		border-radius: 20rpx;
		margin: 20rpx;
		overflow: hidden;

		.block-title {
			background-color: #fff;
			padding: 20rpx;
		}
	}
</style>