<template>
	<view class="page-container">
		<view class="detail-container">
			<view class="discuss-title">{{ discussDetail.title }}</view>
			<rich-text class="discuss-text" :nodes="discussDetail.description"></rich-text>
			<view style="height: 35rpx"></view>
			<span class="cuts" v-for="(cut, index) in discussDetail.cutName">
				{{cut}}
			</span>
			<view style="height: 40rpx"></view>
			<u-line class="line" color="#d8d8d8"></u-line>
			<view style="height: 20rpx"></view>
			<view class="content-box">
				<view class="content-text">
					{{discussDetail.followCount}} <span class="followCount">关注</span> ·
					{{discussDetail.commentCount}} <span class="pinglun" @click="changePopupShow">评论</span> ·
					{{discussDetail.readCount}} <span class="liulanliang">浏览量</span>
				</view>

				<view class="follow">
					<u-button v-show="!discussDetail.isFollowDiscuss" class="follow-question-button" type="primary"
						shape="circle" :plain="true" :ripple="true" ripple-bg-color="#ffffff" :hair-line="false"
						@click="followDiscuss">
						<u-icon name="tags"></u-icon>关注问题
					</u-button>
					<u-button v-show="discussDetail.isFollowDiscuss" class="follow-question-button" shape="circle"
						:plain="true" :ripple="true" ripple-bg-color="#0066FF" :hair-line="false"
						@click="cancelFollowDiscuss">
						<u-icon name="checkmark" class="checkmark"></u-icon>已关注
					</u-button>
				</view>

			</view>
			<view style="height: 20rpx"></view>
		</view>

		<u-gap height="5" bg-color="#F5F5F5"></u-gap>

		<view class="pinglun-tabs">
			<view style="display: flex; justify-content: space-between; align-items: center;">
				<view style="width: 200rpx;">
					<u-tabs :list="tabs" :is-scroll="false" :current="current" @change="change"></u-tabs>
				</view>
				<span class="quanbuneirong">全部内容 {{discussDetail.postCount}} </span>
			</view>
		</view>

		<u-gap height="1" bg-color="#F5F5F5"></u-gap>

		<!-- 话题回答 -->
		<view class="content">
			<block v-for="(item, index) in postList" :key="item.id">
				<view @click="jumpToPostDetail(item)">
					<view class="postList-item">
						<view class="post-item">
							<view @click.stop="toUser(item.uid)">
								<view style="display: flex;align-items: center;">
									<!-- 用户头像 -->
									<u-avatar class="avatar" :src="item.userInfo.face" size="60"></u-avatar>
									<!-- 用户名 -->
									<text class="username">{{ item.userInfo.nickName.substring(0, 10) }}</text>
									<image class="level" :src="`/static/level/level_${item.level}.png`" ></image>
								</view>
							</view>
						</view>

						<view class="center">
							<!-- 回答内容 -->
							<rich-text class="post-text" :nodes="item.content"></rich-text>
						</view>

						<view>
							<span class="yueduliang">{{item.readCount}} 阅读量</span> · <span
								class="pinglun">{{item.commentCount}} 评论</span> · <span
								class="liulanliang">{{item.collectionCount}} 喜欢</span>
						</view>
					</view>
				</view>
			</block>
		</view>

		<block v-if="postList.length === 0">
			<u-empty margin-top="100" text="暂无回答" mode="favor"></u-empty>
		</block>

		<!-- 话题评论弹出框 -->
		<u-popup v-model="popupShow" mode="bottom" border-radius="30" height="400px">
			<view class="comment-box">
				<view class="title">评论（{{ discussDetail.commentCount }}）</view>
				<!-- 父评论 -->
				<view style="margin-bottom: 40rpx;" v-for="(item, index) in commentDiscussList" :key="index">
					<view class="comment-item">
						<!-- 用户头像 -->
						<u-avatar @click="toUser(item.uid)" :src="item.userInfo.face"
							:show-level='item.userInfo.type == 1' level-bg-color="#000000"></u-avatar>
						<view class="c-content" @click.stop="replyToUser(item.userInfo.nickName,item.id)">
							<view class="user">
								<!-- 用户名 -->
								<text>{{ item.userInfo.nickName }}</text>
								<image class="level-icon" :src="`/static/level/level_${item.level}.png`" ></image>
								<!-- 点赞 -->
								<block v-if="item.isThumbs">
									<view @click.stop="cancelThumbs(item.id, index)" class="thumbs">
										<text class="num">{{ item.thumbs }}</text>
										<u-icon class="icon" size="40" name="heart-fill" color="#e62e00"></u-icon>
									</view>
								</block>
								<block v-else>
									<view @click.stop="onThumbs(item.id, index)" class="thumbs">
										<text class="num">{{ item.thumbs }}</text>
										<u-icon class="icon" size="40" name="heart-fill" color="#bfbfbf"></u-icon>
									</view>
								</block>
								<!-- 删除 -->
								<view>
									<u-button ripple shape="circle" class="cancel-btn " size="mini"
										v-if="userInfo.id === item.uid" @click="delCom(item)">
										<u-icon name="trash"></u-icon>
									</u-button>
								</view>

							</view>
							<!-- 评论内容 -->
							<!-- <text class="c-txt">{{ item.content }}</text> -->
							<rich-text :nodes="parseContent(item.content)"></rich-text>
							<!-- 评论时间 -->
							<text class="time">{{item.createTime | TimeFilter(item.createTime)}}</text>
							
							<!-- 子评论 -->
							<block v-if="item.children.length !== 0">
								<view v-for="(childItem, childIndex) in item.children" :key="childIndex" @click.stop="replyToCommentUser(childItem.userInfo,item.id)">
									<view class="comment-wrapper">
										<!-- 用户头像 -->
										<u-avatar @click="jumpUser(childItem.uid)" :src="childItem.userInfo.face"
											:show-level='childItem.userInfo.type == 1' level-bg-color="#000000">
										</u-avatar>
							
										<view class="child-content">
											<view class="user">
												<!-- 用户名 -->
												<text class="nickName">{{ childItem.userInfo.nickName }}</text> 
												<image class="level-icon" :src="`/static/level/level_${childItem.level}.png`" ></image>
												
												<block v-if="childItem.toUser !== null">
													<u-icon name="play-right-fill" size="25"></u-icon>
													<text class="toUser-nickName">{{ childItem.toUser.nickName }}</text> 
													<image class="level-icon" :src="`/static/level/level_${childItem.levelToUser}.png`" ></image>
												</block>
												
												<!-- 点赞 -->
												<block v-if="childItem.isThumbs">
													<view @click.stop="cancelThumbs(childItem.id, index,childIndex)" class="thumbs">
														<text class="num">{{ childItem.thumbs }}</text>
														<u-icon class="icon" size="40" name="heart-fill"
															color="#e62e00"></u-icon>
													</view>
							
												</block>
												<block v-else>
													<view @click.stop="onThumbs(childItem.id, index,childIndex)" class="thumbs">
														<text class="num">{{ childItem.thumbs }}</text>
														<u-icon class="icon" size="40" name="heart-fill"
															color="#bfbfbf"></u-icon>
													</view>
												</block>
												<!-- 删除 -->
												<view>
													<u-button ripple shape="circle" class="cancel-btn " size="mini"
														v-if="userInfo.id === childItem.uid" @click="delCom(childItem)">
														<u-icon name="trash"></u-icon>
													</u-button>
												</view>
							
											</view>
											<!-- 评论内容 -->
											<!-- <text class="c-txt">{{ childItem.content }}</text> -->
											<rich-text :nodes="parseContent(childItem.content)"></rich-text>
											
											<!-- 评论时间 -->
											<text
												class="time">{{childItem.createTime | TimeFilter(childItem.createTime)}}</text>
										</view>
									</view>
								</view>
							</block>
							
							
						</view>
					</view>
				</view>
				<!-- 加载状态 -->
				<block v-if="commentDiscussList.length > 0">
					<view style="margin: 30rpx;">
						<u-loadmore :status="loadStatus" />
					</view>
				</block>
				<block v-else>
					<u-empty text="暂无评论" mode="message"></u-empty>
				</block>
			</view>

			<!-- 评论输入框 -->
<!-- 			<view class="comment-input">
				<textarea :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true" cursor-spacing="10"
					v-model="form.content" auto-height="true" placeholder-class="txt-placeholder" confirm-type="send"
					@confirm="addCommentDiscuss">
				</textarea>
				<u-button @click="addCommentDiscuss" :disabled="canSunbmit" :custom-style="btnStyle"
					style="border-radius: 0;">发布
				</u-button>
			</view> -->
			<view class="tabar_bottom">
				<view class="commentemoji" >
					<textarea class="textarea" :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true" cursor-spacing="10"
						v-model="form.content" :auto-height="true" placeholder-class="txt-placeholder" :confirm-type="send"
						@confirm="addCommentDiscuss">
					</textarea>
					<view class="emoji">
						<text class="emojiIcon" style="font-size: 16px;" @tap="showEmj">😃</text>
					</view>
					<view class="sunbmit">
						<u-button @click="addCommentDiscuss" :disabled="canSunbmit" :custom-style="btnStyle" style="border-radius: 0;">发布</u-button>
					</view>
				</view>
			
				<view style="position: relative;">
					<emotion @emotion="handleEmj" v-if="isShowEmj"></emotion>
				</view>
			</view>

		</u-popup>


		<!-- 写回答、邀请回答、关注问题 -->
		<view class="footer" v-if="!discussDetail.isFollowDiscuss">
			<u-subsection :list="replyList1" :current="curNow" active-color="#ffffff" inactive-color="#000000"
				button-color="#0066FF" bg-color="#ffffff" @change="sectionChange"></u-subsection>
		</view>
		<view class="footer" v-else>
			<u-subsection :list="replyList2" :current="curNow" active-color="#ffffff" inactive-color="#000000"
				button-color="#0066FF" bg-color="#ffffff" @change="sectionChange"></u-subsection>
		</view>

		<!-- 关注提示 -->
		<u-toast ref="uToast" />

	</view>
</template>

<script>
	import {
		discussDetail,
		commentDiscussList,
		addCommentDiscuss,
		onCommentDiscussThumbs,
		cancelCommentDiscussThumbs,
		addFollowDiscuss,
		cancelFollowDiscuss,
		delCommentDiscuss,
	} from '@/api/bbs.js'
	import storage from "@/utils/storage.js";
	import emotion from '@/components/bkhumor-emojiplus/bkhumor-emojiplus.vue';

	export default {
		components: {
			emotion
		},
		filters: {
			TimeFilter(date) {
				let time = Date.parse(date);
				let oldDate = new Date(time)
				let newDate = new Date()
				var dayNum = "";
				var getTime = (newDate.getTime() - oldDate.getTime()) / 1000;

				if (getTime < 60 * 5) {
					dayNum = "刚刚";
				} else if (getTime >= 60 * 5 && getTime < 60 * 60) {
					dayNum = parseInt(getTime / 60) + "分钟前";
				} else if (getTime >= 3600 && getTime < 3600 * 24) {
					dayNum = parseInt(getTime / 3600) + "小时前";
				} else if (getTime >= 3600 * 24 && getTime < 3600 * 24 * 30) {
					dayNum = parseInt(getTime / 3600 / 24) + "天前";
				} else if (getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12) {
					dayNum = parseInt(getTime / 3600 / 24 / 30) + "个月前";
				} else if (time >= 3600 * 24 * 30 * 12) {
					dayNum = parseInt(getTime / 3600 / 24 / 30 / 12) + "年前";
				}

				let year = oldDate.getFullYear();
				let month = oldDate.getMonth() + 1;
				let day = oldDate.getDate();
				let hour = oldDate.getHours();
				let minute = oldDate.getMinutes();
				let second = oldDate.getSeconds();
				return dayNum;
			}
		},
		data() {
			return {
				isShowEmj: false,
				userInfo: storage.getUserInfo(),
				btnStyle: {
					color: "#fff",
					backgroundColor: '#55aaff'
				},
				popupShow: false, //话题评论弹出框状态
				discussId: 0,
				discussDetail: {},
				tabs: [{
					name: '默认'
				}, {
					name: '最新'
				}],
				current: 0,
				curNow: 0,
				commentDiscussList: [], //话题评论列表
				postList: [], //回答列表
				loadStatus: 'loadmore',
				page: 1,
				placeholder: '文明发言哦(不超过50字)',
				focus: false,
				canSunbmit: false,
				form: {
					pid: 0,
					toUid: '',
					discussId: '',
					content: '',
					uid: ''
				},
				replyList1: [{
						name: '写回答'
					},
					{
						name: '邀请回答'
					},
					{
						name: '关注问题'
					}
				],
				replyList2: [{
						name: '写回答'
					},
					{
						name: '邀请回答'
					},
					{
						name: '已关注'
					}
				],
				followDiscussText: "已关注",
				cancelfollowDiscussText: "关注问题",
			};
		},
		methods: {
			change(index) {
				this.current = index;
			},
			// 获取话题详情信息
			getDiscussDetail() {
				discussDetail(this.discussId).then((res) => {
					this.discussDetail = res.data.result;
					this.postList = res.data.result.postDetails;
					console.log("postList", this.postList);
				});
			},
			// 跳转到回答详情
			jumpToPostDetail(item) {
				uni.navigateTo({
					url: '/pages/BBS/post/post?id=' + item.id
				});
			},

			// 跳转到用户页
			toUser(uid) {
				uni.navigateTo({
					url: '/pages/BBS/user/home?uid=' + uid
				});
			},

			// 控制话题评论弹出
			changePopupShow() {
				this.popupShow = true;
				this.getCommentDiscussList();
			},

			// 点赞
			onThumbs(id, index, index2) {
				let onThunbsForm = {
					id: id
				}
				onCommentDiscussThumbs(onThunbsForm).then((res) => {
					if (res.data.code == 0) {
						if (index2 || index2 == 0) {
							this.commentDiscussList[index].children[index2].isThumbs = true;
							this.commentDiscussList[index].children[index2].thumbs++;
						} else {
							this.commentDiscussList[index].isThumbs = true;
							this.commentDiscussList[index].thumbs++;
						}
					}
				});
			},
			// 取消点赞
			cancelThumbs(id, index, index2) {
				let cancelThunbsForm = {
					id: id
				}
				cancelCommentDiscussThumbs(cancelThunbsForm).then((res) => {
					if (res.data.code == 0) {
						if (index2 || index2 == 0) {
							this.commentDiscussList[index].children[index2].isThumbs = false;
							this.commentDiscussList[index].children[index2].thumbs--;
						} else {
							this.commentDiscussList[index].isThumbs = false;
							this.commentDiscussList[index].thumbs--;
						}
					}
				});
			},

			// 输入框失去焦点时
			onBlur() {
				this.placeholder = '留下你的精彩评论...(不超过50字)';
				this.focus = false;
				if(!this.isShowEmj){
					this.form.toUid = '';
					this.form.pid = 0;
				}
				console.log("后：",this.isShowEmj);
			},

			// 获取评论列表
			getCommentDiscussList() {
				this.loadStatus = 'loading';
				commentDiscussList(this.discussId, this.page).then((res) => {
					if (res.data.code == 0) {
						let list = res.data.result.data;
						//如果获取的是第一页的数据直接覆盖原数据，否则将新数据添加在原数据后边
						if (this.page === 1) {
							this.commentDiscussList = list;
						} else {
							this.commentDiscussList = this.commentDiscussList.concat(list);
						}

						if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page ===
							0) {
							this.loadStatus = 'nomore';
						} else {
							this.loadStatus = 'loadmore';
						}

					}
				});
			},
			//发布评论
			addCommentDiscuss() {
				this.canSunbmit = true;
				if (this.form.content == '') {
					this.$u.toast('评论不能为空');
					this.canSunbmit = false;
					return;
				}

				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				this.isShowEmj = false;
				addCommentDiscuss(this.form).then((res) => {
					if (res.data.code == 0) {
						this.form.content = '';
						this.$u.toast('评论成功');
						this.page = 1;
						this.commentDiscussList = [];
						this.form.pid = 0;
						this.getCommentDiscussList();
						this.$set(this.discussDetail,'commentCount',this.discussDetail.commentCount+1)
					}
					this.canSunbmit = false;
					uni.hideLoading();
				});
			},

			//写回答、邀请回答，关注问题
			sectionChange(index) {
				// this.curNow = -1;
				console.log("index:", index);
				if (index === 0) {
					uni.navigateTo({
						url: '/pages/BBS/discuss/reply?discussId=' + this.discussId + '&title=' + this
							.discussDetail.title
					});
				}
				if(index === 1){
					uni.navigateTo({
						url: '/pages/BBS/discuss/invite?discussId=' + this.discussId
					});
				}
				if (index === 2) {
					if (this.discussDetail.isFollowDiscuss) {
						this.cancelFollowDiscuss();
					} else {
						this.followDiscuss();
					}

				}
			},

			// 关注问题
			followDiscuss() {
				let followDiscussForm = {
					discussId: this.discussId
				}
				addFollowDiscuss(followDiscussForm).then((res) => {
					if (res.data.code === 0) {
						this.discussDetail.isFollowDiscuss = true;
						this.$set(this.discussDetail,'followCount',this.discussDetail.followCount+1);
						this.$refs.uToast.show({
							title: '关注成功',
							type: 'success',
							duration: 1000,
							position: 'top '
						})
					}
				});
			},

			// 取消关注问题
			cancelFollowDiscuss() {
				let followDiscussForm = {
					discussId: this.discussId
				}
				cancelFollowDiscuss(followDiscussForm).then((res) => {
					if (res.data.code === 0) {
						this.discussDetail.isFollowDiscuss = false;
						this.$set(this.discussDetail,'followCount',this.discussDetail.followCount-1);
						this.$refs.uToast.show({
							title: '取消关注',
							type: 'default',
							duration: 1000,
							position: 'top '
						})
					}
				});
			},
			
			replyToUser(nickName,pid){
				this.placeholder = `回复 ${nickName}:`;
				this.form.pid = pid;
				this.focus = true;
			},
			
			replyToCommentUser(userInfo,pid){
				this.placeholder = `回复 ${userInfo.nickName}:`;
				this.form.pid = pid;
				this.focus = true;
				this.form.toUid = userInfo.id;
			},
			
			// 删除话题评论
			delCom(val) {
				let vm = this;
				uni.showModal({
					title: "确认删除",
					content: "您确认要删除这条评论吗?",
					loading: true,
					success: function(res) {
						console.log(1);
						if (res.confirm) {
							let delDiscussForm = {
								id: val.id,
							}
							delCommentDiscuss(delDiscussForm).then((res) => {
								if (res.data.code === 0) {
									vm.$u.toast('删除成功');
									vm.page = 1;
									vm.commentDiscussList = [];
									vm.form.pid = 0;
									vm.getCommentDiscussList();
								}
							})
						}
					}
				});
			},
			
			// 渲染emoji
			parseContent(content) {
			    const nodes = [];
			    let lastIndex = 0;
			    
			    // 匹配 [em_数字] 的正则表达式
			    const regex = /\[em_(\d+)\]/g;
			
			    let match;
			    while ((match = regex.exec(content))) {
			      if (match.index > lastIndex) {
			        nodes.push({
			          type: 'text',
			          text: content.slice(lastIndex, match.index),
			        });
			      }
			
			      const emojiNumber = parseInt(match[1], 10);
			      if (emojiNumber >= 1 && emojiNumber <= 97) {
			        nodes.push({
			          name: 'img',
			          attrs: {
			            src: `https://nxc666.oss-cn-hangzhou.aliyuncs.com/emoji${emojiNumber}.gif`,
			            align: 'middle',
			          },
			        });
			      } else {
			        // 如果表情数字不在范围内，保持原始文本
			        nodes.push({
			          type: 'text',
			          text: match[0],
			        });
			      }
			
			      lastIndex = regex.lastIndex;
			    }
			
			    if (lastIndex < content.length) {
			      nodes.push({
			        type: 'text',
			        text: content.slice(lastIndex),
			      });
			    }
			
			    return nodes;
			  },
			
			// 添加表情或删除文字
			handleEmj(i) {
				if (i == '[em_98]') {
					//匹配最后一个表情符号并删除。
					this.form.content = this.form.content.replace(/(\[[^\]]+\]|[\s\S])$/, '');
				} else {
					this.form.content += i;
				}
			},
			// emoji开关
			showEmj() {
				let bool = !this.isShowEmj;
				this.isShowEmj = bool;
				this.$emit('show');
			},
			
			
			
		},
		onLoad(options) {
			console.log("options", options);
			this.discussId = options.id;
			this.form.discussId = options.id;
			this.form.uid = options.uid;
			// this.getDiscussDetail();
		},
		onShow() {
			this.getDiscussDetail();
		},
		onReachBottom() {
			// this.page++;
			// this.getCommentDiscussList();
		},

	}
</script>

<style lang="scss">
	.pinglun-tabs {
		background-color: #ffffff;
	}

	.detail-huida {
		padding: 20rpx;
		background-color: #ffffff;
	}

	.discuss-title {
		font-weight: bold;
		font-size: 48rpx;
		// font-weight: 600;
		margin: 20rpx 0;
	}

	.detail-container {
		padding: 20rpx;
		background-color: #ffffff;
		
		.content-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.content-text{
				margin-top: 20rpx;
			}
		}
	}

	.discusss-text {
		font-size: 30rpx;
		white-space: pre-wrap;
	}

	.cuts {
		border: 1px solid $u-tips-color;
		font-size: 22rpx;
		// color: $u-tips-color;
		margin-top: 5px;
		border-radius: 30rpx;
		padding: 5rpx 12rpx;
		margin-left: 11rpx;
		margin-right: 11rpx;
		margin-top: 2rpx;
		margin-bottom: 8rpx;
	}

	.followCount {
		margin: 0rpx 10rpx;
		color: $u-tips-color;
	}

	.pinglun {
		margin: 0rpx 10rpx;
		color: $u-tips-color;
	}

	.liulanliang {
		margin: 0rpx 10rpx;
		color: $u-tips-color;
	}

	.yueduliang {
		margin-right: 10rpx;
		color: $u-tips-color;
	}

	//话题样式
	.postList-item {
		background: #fff;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.post-content {
			margin-top: 20rpx;

		}
	}

	.post-item {
		display: flex;
		align-items: center;

		.center {
			flex: 1;
			// display: flex;
			// flex-direction: column;
			font-size: 24rpx;
			color: #999;

			.title {
				font-size: 32rpx;
				font-weight: 600;
				color: #616161;
			}

		}
	}

	.post-text {
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 10;
		white-space: pre-wrap;
		overflow: hidden;
		margin-bottom: 20rpx;
		margin-top: 20rpx;
	}

	.username {
		margin-left: 10rpx;
	}
	
	.level{
		height: 27rpx;
		width: 60rpx;
		min-height: 27rpx;
		min-width: 60rpx;
		padding-top: 8rpx;
		padding-bottom: 8rpx;
		padding-left: 10rpx;
	}

	.quanbuneirong {
		margin-right: 20rpx;
		color: $u-tips-color;
	}

	/*评论列表*/
	.comment-box {
		background-color: #ffffff;
		margin-top: 20rpx;
		padding: 20rpx;
	}

	.comment-box>.title {
		margin-bottom: 20rpx;
	}

	.comment-item {
		display: flex;
		padding: 20rpx;

		// &:active {
		// 	background-color: #F5F5F5;
		// }

		.c-content {
			display: flex;
			flex-direction: column;
			flex: 1;

			.time {
				color: #999;
				font-size: 10px;
			}

			.user {
				display: flex;
				
				.level-icon{
					height: 27rpx;
					width: 60rpx;
					min-height: 27rpx;
					min-width: 60rpx;
					padding-top: 8rpx;
					padding-bottom: 8rpx;
					padding-left: 10rpx;
				}

				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;

					.num {
						margin-right: 10rpx;
					}
				}
			}
		}

		.avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
	}

	.sub-comment-item {
		margin-left: 100rpx;
		padding: 20rpx;

		// &:active {
		// 	background-color: #F5F5F5;
		// }

		.user {
			display: flex;
			align-items: center;

			.name {
				color: #616161;
			}

			.avatar {
				margin-right: 10rpx;
			}

			.u-head {
				flex: 1;
				display: flex;

				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;

					.num {
						margin-right: 10rpx;
					}
				}
			}
		}

		.reply {
			.time {
				margin-left: auto;
				font-size: 20rpx;
				color: #999;
			}

			.name {
				display: inline-block;
				color: #55aaff;
				font-weight: 600;
			}
		}
	}

	.comment-input {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		z-index: 999;
	}

	.comment-input textarea {
		background-color: #f5f5f5;
		padding: 20rpx;
		border-radius: 10rpx;
		min-height: 40rpx;
	}

	.comment-input .u-btn {
		margin-left: 10rpx;
	}


	.page-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	// .content {
	//   flex: 1;
	// }

	.footer {
		position: fixed;
		bottom: 20rpx;
		left: 0;
		width: 100%;
	}

	.button-container {
		background-color: #ffffff;
		display: flex;
		/* 使用Flex布局 */
		justify-content: space-between;
		/* 将子元素在父容器中水平分布 */
	}

	.follow {
		display: flex;
		align-items: center;
		margin-right: 30rpx;
	}

	.follow-question-button {
		color: #0066ff;
		height: 24px;
		/* 设置按钮的高度 */
		// width: auto; /* 或者设置一个固定的宽度 */
		// padding: 0 8px; /* 调整按钮的内边距 */
		font-size: 12px;
		/* 调整按钮文本的字体大小 */
		// font-size: 28rpx;
	}

	.checkmark {
		padding-right: 10rpx;
	}
	
	.comment-wrapper {
		display: flex;
		align-items: center;
		
		.child-content {
			display: flex;
			flex-direction: column;
			flex: 1;
		
			.time {
				color: #999;
				font-size: 10px;
			}
		
			.user {
				display: flex;
		
				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;
		
					.num {
						margin-right: 10rpx;
					}
				}
				
				.level-icon{
					height: 27rpx;
					width: 60rpx;
					min-height: 27rpx;
					min-width: 60rpx;
					padding-top: 8rpx;
					padding-bottom: 8rpx;
					padding-left: 10rpx;
				}
				
				.nickName{
					margin-right: 15rpx;
				}
				
				.toUser-nickName{
					margin-left: 15rpx;
				}
			}
		}
	}
	
	.tabar_bottom {
		position: fixed;
		bottom: 0; 
		z-index: 999;
		width: 100%; 
		border-top: 1px solid #EEEEEE; 
		background-color: #ffffff;
		box-sizing: border-box;
		
		.commentemoji{
			display: flex;
			
			.textarea{
				background-color: #f5f5f5;
				padding: 20rpx;
				border-radius: 10rpx;
				min-height: 40rpx;
			}
			.emoji{
				display: flex;
				margin-left: 4rpx;
				background-color: #f5f5f5;
				
				.emojiIcon{
					display: flex;
					align-items: center;
				}
			}
			
			.sunbmit{
				margin-left: 10rpx;
			}
		}
	}
</style>