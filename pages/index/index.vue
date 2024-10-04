<template>
	<view class="content">
		<!-- 首页 -->
		<view :style="{'display':show_index == 0 ?'block':'none'}">
			<home ref="home"></home>
		</view>
		
		<!-- 关注 -->
		<view :style="{'display':show_index == 1 ?'flex':'none'}">
			<guanzu ref="guanzu"></guanzu>
		</view>
		
		<!-- 发布 -->
		<view :style="{'display':show_index == 2? 'block':'none'}">
			<addPost ref="addPost"></addPost>
		</view>
		
		<!-- 论坛 -->
		<view :style="{'display':show_index == 3 ?'block':'none'}">
			<bbs ref="bbs"></bbs>
		</view>
		
		<!-- 我的 -->
		<view :style="{'display':show_index == 4 ? 'flex':'none'}">
			<my ref="my"></my>
			<!-- <tab-mycenter :style="{'display':show_index == 4 ? 'flex':'none'}" ref="mycenter"></tab-mycenter> -->
		</view>
		
		<!-- 自定义导航栏 -->
		<!-- is_lhp判断是否为刘海屏在main.js里，好像uniapp有一个css变量获取刘海屏的安全区域 -->
		<view class="tabBar" :style="{height:is_lhp?'140rpx':'98rpx'}">
			<!-- 导航的中间圆圈 --> 
			<view class="border_box" :style="{paddingBottom:is_lhp?'40rpx':''}">
				<view class="tabBar_miden_border"></view>
			</view>
			<view class="tabBar_list" :style="{paddingBottom:is_lhp?'40rpx':''}">
				<view v-for="(item) in tab_nav_list" :key="item.id" :class="{'tabBar_item':item.id!=2,'tabBar_item2':item.id==2}" @tap="cut_index(item.id)">
					<image v-if="show_index == item.id"  :src="`../../static/tabBar/${item.id+1}${item.id+1}.png`"></image>
					<image v-else :src="`../../static/tabBar/${item.id+1}.png`"></image>
					<view :class="{'tabBar_name':true,'nav_active':show_index == item.id}">{{item.name}}</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import home from 'pages/tabbar/home/index';
	import guanzu from 'pages/tabbar/screen/fullScreen';
	import addPost from 'pages/tabbar/add/index';
	import bbs from 'pages/tabbar/bbsIndex/index';
	import my from 'pages/tabbar/user/my';
	
	export default {
		components: {
			home,
			guanzu,
			addPost,
			bbs,
			my
		},
		data() {
			return {
				show_index:0,//控制显示那个组件
				tab_nav_list :[{'id':0,'name':'首页'},{'id':1,'name':'关注'},{'id':2,'name':'发布'},{'id':3,'name':'论坛'},{'id':4,'name':'我的'}],//菜单列表
				is_lhp:false
			}
		},
		onLoad() {
			let _this = this
			this.is_lhp = this.$is_bang
			this.$nextTick(function(){
				// 一定要等视图更新完再调用方法   -----------++++++++++++++++重要
				setTimeout(function(){
					uni.setNavigationBarColor({
						frontColor: '#ffffff',
						// backgroundColor: '#6739b6'
					})
				},100)
			})
			// 加载首页帖子
			this.$refs.home.loadData();
		},
		onReachBottom(){
			// 给子级监听触底加载
			uni.$emit('onReachBottom', true)
			
			if(this.show_index === 0 && this.$refs.home.current === 0){
				this.$refs.home.loadmore();
			}
		},
		methods: {
			// 切换组件
			cut_index(type){
				console.log('----------------------------------',type)
				let _this = this
				_this.show_index = type
				if(_this.show_index == 0){
					
				}
				else if(_this.show_index == 1){
					
				}
				else if(_this.show_index == 2){
					
				}
				else if(_this.show_index == 3){
					
				}
				else if(_this.show_index == 4){

				}
			},
			onPullDownRefresh(){
				uni.showToast({
					title:`第${this.show_index+1}个页面的刷新`
				})
				if(this.show_index === 0 && this.$refs.home.current === 0){
					this.$refs.home.refresherrefreshFun();
				}
				// console.log('下拉刷新四个组件公用的下拉刷新方法,根据在哪个页面下拉执行哪个页面的刷新方方法即可')
				// console.log('如果想要自定义刷新的话，插件市场就有一个   非常好用也非常容易入手')
			}
		}
	}
</script>

<style lang="scss">
	.tabBar{ width:100%;height: 98rpx;background: #fff;border-top:1px solid #E5E5E5;position: fixed;bottom:0px;left:0px;right:0px;display: flex;align-items: center;justify-content: center;
		.tabBar_list{ width:86%;display: flex;justify-content: space-between;
			image{ width:48rpx;height: 48rpx;margin-bottom:2rpx}
			.tabBar_item{ width:68rpx;display: flex;justify-content: center;align-items: center;flex-direction: column;font-size: 20rpx;color: #969BA3;}
			.tabBar_item2{
				width:68rpx;height:100%;display: flex;justify-content: center;align-items: center;flex-direction: column;font-size: 20rpx;color: #969BA3;margin-top:-20rpx;position: relative;z-index: 101;
				image{ width:68rpx;height: 68rpx;}
			}
		 } 
	}
	.border_box{
		// pointer-events: none; 事件穿透解决z-index层级问题
		width:100%;height: 100rpx;display: flex;justify-content: center;align-items: center;position: fixed;left:0px;bottom:50rpx;z-index: 100;pointer-events: none;
		.tabBar_miden_border{ width:100rpx;height:50rpx;border-top:2rpx solid #E5E5E5;border-radius:50rpx 50rpx 0 0; /* 左上、右上、右下、左下 */background: #fff;}
	}
	.nav_active{color: #ff573e;}
</style>
