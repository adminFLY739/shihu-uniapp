<template>
	<view>
		<!-- 常用工具 -->
		<view class="interact-tools" style="margin-bottom: 15px">
			<view class="interact-container">
				<!-- 		<text
						style="padding-left: 50rpx ;padding-top:20rpx ;width: 100% ;font-size: 30rpx;font-weight: bold"
						class="flex flex-direction">
						消息
					</text> -->
				<view class="interact-item" @click="linkMsgDetail()">
					<view class="talk-time">
						<u-badge type="error" absolute :offset="[-10, 15]" :count="allMessageUnReadCount"></u-badge>
					</view>
					<image src="/static/mine/message.png" mode=""></image>
					<view>我的消息</view>
				</view>

				<!-- 			<view class="interact-item" @click="linkManagerMsg()">
						<view class="talk-time">
							<u-badge type="error" absolute :offset="[-10, 15]" :count="MsgTotal"></u-badge>
						</view>
						<image src="/static/mine/mycommit.png" mode=""></image>
						<view>系统消息</view>
					</view> -->

				<!-- 	<text
						style="padding-left: 50rpx ;padding-top:20rpx ;width: 100% ;font-size: 30rpx;font-weight: bold"
						class="flex flex-direction">论坛
					</text> -->

				<view class="interact-item" @click="navigateTo('/pages/BBS/user/user')">
					<image src="/static/mine/shensu.png" mode=""></image>
					<view>个人中心</view>
				</view>

				<!-- 	<view class="interact-item" @click="navigateTo('/pages/BBS/user/user')">
						<image src="/static/mine/shensu.png" mode=""></image>
						<view>创作中心</view>
					</view> -->


				<!-- 		<text
						style="padding-left: 50rpx ;padding-top:20rpx ;width: 100% ;font-size: 30rpx;font-weight: bold"
						class="flex flex-direction">个人</text> -->

				<view class="interact-item" @click="navigateTo('/pages/mine/set/feedBack')">
					<image src="/static/mine/feedback.png" mode=""></image>
					<view>意见反馈</view>
				</view>

				<!-- 	<view class="interact-item" @click="navigateTo('/pages/mine/realNameAuth/realNameAuth')">
					<image src="/static/mine/pointgift.png" mode=""></image>
					<view>实名认证</view>
				</view> -->

				<view class="interact-item" @click="navigateTo('/pages/mine/set/setUp')">
					<image src="/static/mine/setting.png" mode=""></image>
					<view>设置</view>
				</view>

			</view>
		</view>

		<!-- 用户等级 -->
		<view class="grade">
			<view class="grade-container" @click="creativeCenter">
				<view class="text">提等级</view>
				<view class="separator">|</view>
				<view class="text2">距下个等级仅需 <span class="point">{{pointNeed}}</span> 创作分</view>
				<u-icon class="route-creative-center" name="arrow-right" ></u-icon>
				<u-steps class="steps" :list="gradeList" :current="userlv"></u-steps>
			</view>
		</view>

		<!-- 每日任务 -->
		<view class="assignment">
			<view class="assignment-container">
				<view class="title">创作任务</view>
				<view class="rule" @click="showRule">
					<view class="text">任务规则</view>
					<u-icon class="rule-icon" name="question-circle"></u-icon>
				</view>

				<view class="assignment-content" v-for="(item) in taskList" :key="item.id">
					<view class="content">
						<view class="description">{{item.description}}</view>
						<view class="reward">完成后可获得额外 <span class="point">{{item.reward}}</span> 创作分</view>
					</view>

					<u-button v-if="!item.isComplete" class="button" shape="circle" :plain="true" type="primary"
						size="mini" @click="goToCompleteTask(item.id)">去完成</u-button>
					<u-button v-else class="button" shape="circle" :plain="true" size="mini"
						:disabled="true">已完成</u-button>
				</view>


			</view>
		</view>
		<!-- 防止tabBar遮住内容 -->
		<view style="height: 55rpx"></view>


		<u-popup class="popup" v-model="show" mode="bottom" border-radius="30" :closeable="true">
			<view class="content">
				<view class="title">创作任务规则</view>
				<view class="p">请您留意：</view>
				<view class="p">任务于每日 0 点更新状态，需在每日 0 点至 24 点间按照任务规则完成相应任务，完成后任务状态变更为「已完成」，即可获得额外创作分加分；</view>
				<view class="p">创作任务的创作内容需符合任务规则（如字数、图片等），并确保状态正常、未违规、未删除、不匿名、且未被修改为不符合任务规则的内容。
					首次发布、或编辑修改的内容需要经过审核后才能正式发布，待内容审核通过后，请耐心等待；</view>
				<view class="p">互动任务的互动行为需符合任务规则，并确保已赞同、已关注的行为不撤销；</view>
				<view class="p">任务完成后，所获得的额外奖励创作分以「社区成就分」维度加分，将在次日跟随创作分更新自动发放，
				无需手动领取，可于次日进入「创作中心」点击「创作分分值」在「创作分明细」中查询加分记录。</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import storage from "@/utils/storage";
	import {
		getAllMessageNoReadCount,
		getTaskList
	} from '@/api/bbs.js'
	import {
		getMemberPointSum
	} from '@/api/members.js'

	export default {

		data() {
			return {
				show: false, //任务规则弹出框标记
				storage,
				talkTotal: 0,
				MsgTotal: 0,
				allMessageUnReadCount: 0,
				gradeList: [{
					name: 'Lv1'
				}, {
					name: 'Lv2'
				}, {
					name: 'Lv3'
				}, {
					name: 'Lv4'
				}, {
					name: 'Lv5'
				}, ],
				pointNeed: 0,
				userlv: 0,
				taskList: []
			}
		},

		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url,
				});
			},

			linkMsgDetail() {
				uni.navigateTo({
					url: `/pages/mine/message/list`,
				});
			},

			// linkManagerMsg() {
			// 	uni.navigateTo({
			// 		url: `/pages/tabbar/home/title`,
			// 	});
			// },
			allMessageNoReadCount() {
				getAllMessageNoReadCount().then((res) => {
					this.allMessageUnReadCount = res.data.result;
				});
			},

			// 获取用户积分
			getUserPoint() {
				getMemberPointSum().then((res) => {
					if (res.data.code === 200) {
						let point = res.data.result.totalPoint;
						console.log("用户当前积分：", point)
						if (point >= 0 && point < 250) {
							this.pointNeed = 250 - point;
							this.userlv = 0;
							console.log("升级所需积分：", this.$data.pointNeed);
						} else if (point >= 250 && point < 600) {
							this.pointNeed = 600 - point;
							this.userlv = 1;
						} else if (point >= 600 && point < 2500) {
							this.pointNeed = 2500 - point;
							this.userlv = 2;
						} else if (point >= 2500 && point < 9500) {
							this.pointNeed = 9500 - point;
							this.userlv = 3;
						} else if (point >= 9500) {
							this.pointNeed = 0;
							this.userlv = 4;
						}
					}
				});
			},

			// 获取每日任务
			loadTaskList() {
				getTaskList().then((res) => {
					console.log("获取每日任务：", res)
					this.taskList = res.data.result;
				});
			},

			// 去完成任务
			goToCompleteTask(taskId) {
				console.log("taskId:", taskId)
				if (taskId === 1) {
					this.$emit('custom-event', 0); // 触发父组件的自定义事件并传递参数
				} else if (taskId === 2) {
					this.navigateTo("/pages/BBS/post/add");
				} else if (taskId === 3) {
					this.$emit('custom-event', 0);
				} else {
					this.$emit('custom-event', 0);
				}
			},

			//任务规则
			showRule() {
				this.show = true;
			},
			
			creativeCenter(){
				setTimeout(() => {
					uni.showToast({
						title: "创作中心功能正在开发中",
						icon: "none",
						duration: 1500,
					});
				}, 0)
			}
		},
	};
</script>

<style lang="scss" scoped>
	.interact-tools {
		border-left: none;
		border-right: none;

		.interact-container {
			margin: 0 20rpx;
			background: #fff;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);

			image {
				width: 52rpx;
				height: 52rpx;
				margin-bottom: 6rpx;
			}

			display: flex;
			align-items: center;
			flex-wrap: wrap;
			text-align: center;

			.interact-item {
				font-size: $font-sm;
				width: 25%;
				height: 160rpx;
				padding: 30rpx;
			}
		}

		.talk-time {
			position: relative;
		}
	}

	.grade {
		border-left: none;
		border-right: none;
		margin-bottom: 15px;

		.grade-container {
			margin: 0 20rpx;
			background: #fff;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			text-align: center;
			padding: 20rpx;

			.text {
				font-weight: bold;
				margin-right: 30rpx;
			}

			.separator {
				color: #DCDCDC;
			}

			.text2 {
				margin-left: 30rpx;

				.point {
					padding: 0 8rpx;
					color: #00BFFF;
				}
			}

			.text,
			.separator,
			.text2 {
				text-align: left;
			}

			.steps {
				margin-top: 20rpx;
			}

			.route-creative-center {
				margin-left: auto;
				text-align: right;
			}
		}
	}

	.assignment {
		border-left: none;
		border-right: none;
		margin-bottom: 30rpx;

		.assignment-container {
			margin: 0 20rpx;
			background: #fff;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			text-align: center;
			padding: 20rpx;

			.title {
				font-size: 32rpx;
				text-align: left;
			}

			.rule {
				display: flex;
				margin-left: auto;
				text-align: right;
				align-items: center;

				.text {
					color: #616161;
				}

				.rule-icon {
					color: #616161;
					margin-left: 10rpx;
				}
			}

			.assignment-content {
				margin: 20rpx;
				display: flex;
				width: 100%; //位置不够会导致居右时，无法紧贴屏幕右边

				.content {
					display: flex;
					text-align: left;
					flex-direction: column;

					.description {
						margin-bottom: 5rpx;
					}

					.reward {
						font-size: 24rpx;
						color: #616161;

						.point {
							padding: 0 8rpx;
							color: #00BFFF;
						}
					}
				}

				.button {
					margin-left: auto;
					text-align: right;
					align-items: center;
					margin-top: 10rpx;
				}
			}
		}
	}

	.popup {

		.content {
			margin: 20rpx;
			margin-bottom: 65rpx;
			padding-bottom: 65rpx;
			font-size: 30rpx;

			.title {
				font-weight: bold;
				font-size: 30rpx;
				text-align: left;

			}
			.p{
				margin: 15rpx 0;
			}
		}

	}
</style>