<template>
	<div class="wrapper">
		<!-- uni 中不能使用 vue component 所以用if判断每个组件 -->
		<div v-for="(item, index) in pageData.list" :key="index">
			<!-- 搜索栏，如果在楼层装修顶部则会自动浮动，否则不浮动 -->
			<u-navbar class="navbar" v-if="item.type === 'search'" :is-back="false" :is-fixed="index!==1">
				<u-search placeholder="请输入搜索关键词" shape="round" :clearabled="true" :show-action="false"
					v-model="keyword" style="width: 100%;margin: 0 20rpx;" @search="searchTip" ></u-search>
				<div slot="right" class="navbar-right">
					<view class="talk-time">
						<u-badge type="error" is-center absolute :count="allMessageUnReadCount"></u-badge>
					</view>
					<u-icon name="bell" @click="linkMsgDetail" color="#666" size="50"></u-icon>
				</div>
			</u-navbar>

		</div>
	</div>
</template>

<script>
	// 结束引用组件
	import {
		getFloorData
	} from "@/api/home"; //获取楼层装修接口
	import config from "@/config/config";

	import storage from "@/utils/storage.js";

	export default {
		props: {
			allMessageUnReadCount: Number
		},
		data() {
			return {
				config,
				storage,
				pageData: "", //楼层页面数据
				enableLoad: false, //触底加载 针对于商品模块
				keyword: ''
			};
		},

		mounted() {
			this.init();
			// #ifdef MP-WEIXIN
			// 小程序默认分享
			uni.showShareMenu({
				withShareTicket: true
			});
			// #endif
		},
		methods: {
			
			searchTip(value){
				setTimeout(() => {
					uni.showToast({
						title: "搜索功能正在开发中",
						icon: "none",
						duration: 1500,
					});
				}, 0)
			},
			
			linkMsgDetail() {
				uni.navigateTo({
					url: `/pages/mine/message/list`,
				});
			},

			/**
			 * 实例化首页数据楼层
			 */
			init() {
				this.pageData = "";
				let tenantId
				if (storage.getMainTenant()) {
					tenantId = storage.getMainTenant();
				} else {
					tenantId = {
						tenantId: "0"
					};
				}
				getFloorData(tenantId).then((res) => {
					if (res.data.success) {
						const result = JSON.parse(res.data.result.pageData)
						this.pageData = result;
						console.log("pageData", result);
					}
				});
			},

		},
	};
</script>

<style scoped lang="scss">
	.navbar-right {
		padding: 0 16rpx 0 0;
	}

	.talk-time {
		position: relative;
	}
</style>