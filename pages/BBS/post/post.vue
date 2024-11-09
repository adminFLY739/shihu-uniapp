<template>
	<view>
		<view>
			<view class="detail-container">
				<view class="user-item">
					<view style="display: flex; align-items: center; justify-content: flex-end; width: 100%;">
						<u-avatar @click="jumpUser(postDetail.uid)" :src="postDetail.userInfo.face"
							:show-level='postDetail.userInfo.type == 1' level-bg-color="#000000"></u-avatar>

						<view class="user-item-user">
							<text class="user-name">{{ postDetail.userInfo.nickName }}</text>
						</view>
						
						<!-- <image src="https://demo.linfeng.tech/resource/vip/level_3.png" class="vip-level-image"></image> -->
						<view class="vip-level-image">
							<image class="image" :src="`/static/level/level_${postDetail.level}.png`" ></image>
						</view>

						<u-button v-show="postDetail.isFollow" size="mini" style="font-size: 14px;"
							@click="cancelFollow">已关注</u-button>
						<u-button v-show="!postDetail.isFollow" size="mini" style="font-size: 14px;"
							@click="follow">关注</u-button>
					</view>



				</view>
				<view class="icon">
					<text>{{ postDetail.createTime | TimeFilter(postDetail.createTime)}}</text>
				</view>
				<view class="hr"></view>
				<view class="post-title">{{ postDetail.title }}</view>
				<rich-text class="post-text" :nodes="postDetail.content"></rich-text>
				<view style="height: 20rpx"></view>
				<!-- 图片 -->
				<block v-if="postDetail.type == 1 && postDetail.media !== null">
					<!--一张图片-->
					<block v-if="postDetail.media.length == 1">
						<image class="img-style-1" @tap.stop="previewImage" mode="aspectFill"
							:data-current="postDetail.media[0]" :data-image="postDetail.media"
							:src="postDetail.media[0]">
						</image>
					</block>
					<!--二张图片-->
					<block v-if="postDetail.media.length == 2">
						<view class="img-style-2">
							<image v-for="(mediaItem, index2) in postDetail.media" :key="index2"
								@tap.stop="previewImage" mode="aspectFill" :data-current="mediaItem"
								:data-image="postDetail.media" :src="mediaItem">
							</image>
						</view>
					</block>
					<!--三张图片-->
					<block v-if="postDetail.media.length ==3">
						<view class="img-style-3">
							<image v-for="(mediaItem, index2) in postDetail.media" :key="index2"
								@tap.stop="previewImage" mode="aspectFill" :data-current="mediaItem"
								:data-image="postDetail.media" :src="mediaItem">
							</image>
						</view>
					</block>
					<!--四张图片-->
					<block v-if="postDetail.media.length == 4">
						<view class="img-style-4">
							<image v-for="(mediaItem, index2) in postDetail.media" :key="index2"
								@tap.stop="previewImage" mode="aspectFill" :data-current="mediaItem"
								:data-image="postDetail.media" :src="mediaItem">
							</image>
						</view>
					</block>

				</block>
			</view>

			<!--点赞、收藏、分享、评论-->
			<view class="menu-container">

				<view class="left-section">
					<!-- 点赞 -->
					<block v-if="postDetail.isPostThumb">
						<view class="p-item" @click="cancelPostThumb">
							<u-icon name="thumb-up-fill" color="#cc0000"></u-icon>
							<text>{{postDetail.thumbCount}}</text>
						</view>
					</block>
					<block v-else>
						<view class="p-item" @click="addPostThumb">
							<u-icon name="thumb-up"></u-icon>
							<text>{{postDetail.thumbCount}}</text>
						</view>
					</block>
					<!-- 踩 -->
					<block v-if="postDetail.isPostOppose">
						<view class="p-item" @click="cancelPostOppose">
							<u-icon name="thumb-down-fill" color="#000"></u-icon>
							<text>{{postDetail.opposeCount}}</text>
						</view>
					</block>
					<block v-else>
						<view class="p-item" @click="addPostOppose">
							<u-icon name="thumb-down"></u-icon>
							<text>{{postDetail.opposeCount}}</text>
						</view>
					</block>
				</view>

				<view class="right-section">
					<!-- 收藏 -->
					<block v-if="postDetail.isCollection">
						<view class="p-item" @click="cancelCollection">
							<u-icon name="heart-fill" color="#cc0000"></u-icon>
							<text>{{ postDetail.collectionCount }}</text>
						</view>
					</block>
					<block v-else>
						<view class="p-item" @click="addCollection">
							<u-icon name="heart"></u-icon>
							<text>{{ postDetail.collectionCount }}</text>
						</view>
					</block>

					<!-- 评论 -->
					<view class="p-item" @click="focus = true">
						<u-icon name="chat" size="32"></u-icon>
						<text>{{ postDetail.commentCount }}</text>
					</view>

					<!-- 分享 -->
					<view class="p-item" @click="showShare = true">
						<u-icon name="zhuanfa" size="32"></u-icon>
						<text>分享</text>
					</view>
				</view>

			</view>


		</view>

		<!-- <u-line color="#d8d8d8"></u-line> -->

		<view class="comment-box">
			<view class="title">评论（{{ postDetail.commentCount }}）</view>
			<!-- 父评论 -->
			<view style="margin-bottom: 40rpx;" v-for="(item, index) in commentList" :key="index">
				<view class="comment-item">
					<!-- 用户头像 -->
					<u-avatar @click="jumpUser(item.uid)" :src="item.userInfo.face"
						:show-level='item.userInfo.type == 1' level-bg-color="#000000">
					</u-avatar>
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
						<rich-text :nodes="parseContent(item.content)"></rich-text>

						<!-- 评论时间 -->
						<text class="time">{{item.createTime | TimeFilter(item.createTime)}}</text>

						<!-- 子评论 -->
						<block v-if="item.children.length !== 0">
							<view v-for="(childItem, childIndex) in item.children" :key="childIndex">
								<view class="comment-wrapper">
									<!-- 用户头像 -->
									<u-avatar @click="jumpUser(childItem.uid)" :src="childItem.userInfo.face"
										:show-level='childItem.userInfo.type == 1' level-bg-color="#000000">
									</u-avatar>

									<view class="child-content"
										@click.stop="replyToCommentUser(childItem.userInfo,item.id)">
										<view class="user">
											<!-- 用户名 -->
											<text class="nickName">{{ childItem.userInfo.nickName }}</text>
											<image class="level-icon" :src="`/static/level/level_${childItem.level}.png`" ></image>
											
											<block v-if="childItem.toUser !== null">
												<u-icon name="play-right-fill" size="20"></u-icon>
												<text class="toUser-nickName">{{ childItem.toUser.nickName }}</text>
												<image class="level-icon" :src="`/static/level/level_${childItem.levelToUser}.png`" ></image>
											</block>

											<!-- 点赞 -->
											<block v-if="childItem.isThumbs">
												<view @click.stop="cancelThumbs(childItem.id, index,childIndex)"
													class="thumbs">
													<text class="num">{{ childItem.thumbs }}</text>
													<u-icon class="icon" size="40" name="heart-fill"
														color="#e62e00"></u-icon>
												</view>

											</block>
											<block v-else>
												<view @click.stop="onThumbs(childItem.id, index,childIndex)"
													class="thumbs">
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
			<block v-if="commentList.length > 0">
				<view style="margin: 30rpx;">
					<u-loadmore :status="loadStatus" />
				</view>
			</block>
			<block v-else>
				<u-empty text="暂无评论" mode="message"></u-empty>
			</block>
		</view>
		<view style="height: 100rpx;"></view>

		<!-- 评论输入框 -->
		<!-- 		<view class="comment-input">
			<textarea :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true" cursor-spacing="10"
				v-model="form.content" :auto-height="true" placeholder-class="txt-placeholder" :confirm-type="send"
				@confirm="addComment" @input="input">
			</textarea>
			<u-button @click="addComment" :disabled="canSunbmit" :custom-style="btnStyle"
				style="border-radius: 0;">发布</u-button>
		
			<emotion class="emotion-container" @emotion="handleEmj" :height="200" v-if="isShowEmj"></emotion>
		</view> -->
		<view class="tabar_bottom">
			<view class="commentemoji">
				<textarea class="textarea" :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true"
					cursor-spacing="10" v-model="form.content" :auto-height="true" placeholder-class="txt-placeholder"
					:confirm-type="send" @confirm="addComment">
				</textarea>
				<view class="emoji">
					<text class="emojiIcon" style="font-size: 16px;" @tap="showEmj">🤓</text>
				</view>
				<view class="sunbmit">
					<u-button @click="addComment" :disabled="canSunbmit" :custom-style="btnStyle"
						style="border-radius: 0;">发布</u-button>
				</view>
			</view>

			<view style="position: relative;">
				<emotion @emotion="handleEmj" v-if="isShowEmj"></emotion>
			</view>
		</view>





		<!-- 分享选择弹窗 -->
		<u-popup v-model="showShare" mode="bottom" height="240rpx">
			<view class="post-share-container" @click="showShare = false">
				<!-- #ifdef MP -->
				<button open-type="share" class="share-item u-reset-button">
					<image src="/static/img/wechat.png"></image>
					<text>微信好友</text>
				</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="share-item2" @click="copyPageUrl">
					<image src="/static/img/share.png"></image>
					<text>分享链接</text>
				</view>
				<!-- #endif -->
			</view>
		</u-popup>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		postDetail,
		commitList,
		cancelCollection,
		addCollection,
		addFollow,
		cancelFollow,
		addComment,
		onThumbs,
		cancelThumbs,
		delComment,
		addPostThumb,
		cancelPostThumb,
		addPostOppose,
		cancelPostOppose,
	} from "@/api/bbs";
	import storage from "@/utils/storage.js";
	import WebView from "../../tabbar/home/web-view.vue";
	import {
		textReplaceEmoji
	} from "../../../utils/emojis.js";
	import emotion from '@/components/bkhumor-emojiplus/bkhumor-emojiplus.vue';


	export default {
		components: {
			WebView,
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
				btnStyle: {
					color: "#fff",
					backgroundColor: '#55aaff'
				},
				userInfo: storage.getUserInfo(),
				postId: 0,
				postDetail: {
					comment: [],
					media: [],
					commentList: {
						data: []
					},
					topicInfo: {
						topicName: ''
					}
				},
				focus: false,
				canSunbmit: false,
				commentList: [],
				placeholder: '文明发言哦(不超过200字)',
				form: {
					pid: 0,
					type: 1,
					toUid: '',
					postId: '', //加载页面时绑定
					content: '',
					receiverUid: 0
				},
				showShare: false,
				shareBtnStyle: {
					backgroundColor: '#333'
				},
				page: 1,
				loadStatus: 'loadmore',

			};
		},
		onLoad(options) {
			this.postId = options.id;

			if (options.scene) {
				this.postId = options.scene;
			}
			if (options.mid) {
				this.messageRead(options.mid);
			}

			// 加载页面时绑定当前帖子id
			this.form.postId = this.postId;
			this.getPostDetail();
			this.getCommentList();

			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			//#endif
		},
		onReachBottom() {
			this.page++;
			this.getCommentList();
		},
		onShareAppMessage(res) {
			let imgURL;
			if (this.postDetail.media.length > 0) {
				imgURL = this.postDetail.media[0];
			}
			return {
				title: this.postDetail.content,
				path: '/pages/BBS/post/post?id=' + this.postId,
				imageUrl: imgURL
			};
		},
		onShareTimeline() {
			let imgURL = (imgURL = this.postDetail.media[0]);
			return {
				title: this.postDetail.content,
				imageUrl: imgURL,
				query: 'id=' + this.postId
			};
		},
		methods: {
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

			renderTime(date) {
				var dateee = new Date(date).toJSON();
				return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/,
					'');
			},
			messageRead(mid) {
				this.$H
					.post('message/readMessage', {
						postId: this.postId,
						mid: mid
					})
					.then(res => {

					});
			},
			copyPageUrl() {
				let that = this;
				uni.setClipboardData({
					data: this.$c.shareH5Url + 'pages/post/detail?id=' + this.postId,
					success: function() {
						uni.hideToast();
						uni.showToast({
							title: '复制成功快分享给好友叭~',
							icon: 'success',
							duration: 2000,
						})
						that.showShare = false;
					}
				});
			},
			// 点赞
			onThumbs(id, index, index2) {

				let onThunbsForm = {
					id: id
				}
				onThumbs(onThunbsForm).then((res) => {
					if (res.data.code == 0) {
						if (index2 || index2 == 0) {
							this.commentList[index].children[index2].isThumbs = true;
							this.commentList[index].children[index2].thumbs++;
						} else {
							this.commentList[index].isThumbs = true;
							this.commentList[index].thumbs++;
						}
					}
				});
			},
			// 取消点赞
			cancelThumbs(id, index, index2) {
				let cancelThunbsForm = {
					id: id

				}
				cancelThumbs(cancelThunbsForm).then((res) => {
					if (res.data.code == 0) {
						if (index2 || index2 == 0) {
							this.commentList[index].children[index2].isThumbs = false;
							this.commentList[index].children[index2].thumbs--;
						} else {
							this.commentList[index].isThumbs = false;
							this.commentList[index].thumbs--;
						}
					}
				});
			},
			delCom(val) {
				let vm = this;
				uni.showModal({
					title: "确认删除",
					content: "您确认要删除这条评论吗?",
					loading: true,
					success: function(res) {
						console.log(1);
						if (res.confirm) {
							let delPostForm = {
								id: val.id,
							}
							delComment(delPostForm).then((res) => {
								if (res.data.code === 0) {
									vm.$u.toast('删除成功');
									vm.page = 1;
									vm.commentList = [];
									vm.form.pid = 0;
									vm.getCommentList();
								}
							})
						}
					}
				});
			},
			// 输入框失去焦点时
			onBlur() {
				this.placeholder = '留下你的精彩评论...(不超过200字)';
				this.focus = false;
				if (!this.isShowEmj) {
					this.form.toUid = '';
					this.form.pid = 0;
				}
			},
			// 获取评论列表
			getCommentList() {
				this.loadStatus = 'loading';
				commitList(this.postId, this.page).then((res) => {
					if (res.data.code == 0) {
						this.commentList = this.commentList.concat(res.data.result.data);
						if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page ===
							0) {
							this.loadStatus = 'nomore';
						} else {
							this.loadStatus = 'loadmore';
						}
					}
				});
			},


			jumpUser(uid) {
				uni.navigateTo({
					url: '/pages/BBS/user/home?uid=' + uid
				});
			},

			// 添加评论
			addComment() {
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
				addComment(this.form).then((res) => {
          console.log("commentListcommentListcommentList", JSON.stringify(this.form));
					if (res.data.code == 0) {
						this.form.content = '';
						this.$u.toast('评论成功');
						this.page = 1;
						this.commentList = [];
						this.form.pid = 0;
						this.getCommentList();
					}
					this.canSunbmit = false;
					uni.hideLoading();
				});
			},
			getPostDetail() {
				postDetail(this.postId).then((res) => {
					if (res.data.code == 500) {
						this.$u.toast(res.data.msg);
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/tabbar/bbsIndex/index'
							});
						}, 1500);
					}
					this.postDetail = res.data.result;
					this.form.receiverUid = this.postDetail.userInfo.id;
				});
			},
			// 取消收藏
			cancelCollection() {
				let cancelForm = {
					id: this.postId,

				}
				cancelCollection(cancelForm).then((res) => {
					if (res.data.code === 0) {
						this.postDetail.isCollection = false;
						this.postDetail.collectionCount--;
					}
				});
			},
			// 添加收藏
			addCollection() {
				let addColForm = {
					id: this.postId,
					uid: this.postDetail.uid
				}
				addCollection(addColForm).then((res) => {
					if (res.data.code === 0) {
						this.postDetail.isCollection = true;
						this.postDetail.collectionCount++;
					}
				});
			},
			// 取消赞同
			cancelPostThumb() {
				let cancalPostThumbForm = {
					id: this.postId,

				}
				cancelPostThumb(cancalPostThumbForm).then((res) => {
					if (res.data.code === 0) {
						this.postDetail.isPostThumb = false;
						this.postDetail.thumbCount--;
					}
				});
			},
			// 添加赞同
			addPostThumb() {
				let addPostThumbForm = {
					id: this.postId,
					uid: this.postDetail.uid
				}
				addPostThumb(addPostThumbForm).then((res) => {
					if (res.data.code === 0) {
						this.postDetail.isPostThumb = true;
						this.postDetail.thumbCount++;
					}
				});
			},

			// 取消反对
			cancelPostOppose() {
				let cancalPostOpposeForm = {
					id: this.postId,

				}
				cancelPostOppose(cancalPostOpposeForm).then((res) => {
					if (res.data.code === 0) {
						this.postDetail.isPostOppose = false;
						this.postDetail.opposeCount--;
					}
				});
			},
			// 添加反对
			addPostOppose() {
				let addPostOpposeForm = {
					id: this.postId,
					uid: this.postDetail.uid
				}
				addPostOppose(addPostOpposeForm).then((res) => {
					if (res.data.code === 0) {
						this.postDetail.isPostOppose = true;
						this.postDetail.opposeCount++;
					}
				});
			},

			addThumb() {
				this.$H
					.post('post/addThumb', {
						id: this.postId
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isThumb = true;
						}
					});
			},
			cancelThumb() {
				this.$H
					.post('post/cancelThumb', {
						id: this.postId,
						uid: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isThumb = false;
						}
					});
			},

			// 关注用户
			follow() {
				let followForm = {
					id: this.postDetail.uid
				}
				addFollow(followForm).then((res) => {
					if (res.data.code === 0) {
						this.postDetail.isFollow = true;
					}
					// else {
					// 	this.$refs.uToast.show({
					// 		title: res.data.msg,
					// 		type: 'error'
					// 	});
					// }
				});

			},
			// 取消关注用户
			cancelFollow() {
				let followForm = {
					id: this.postDetail.uid
				}
				cancelFollow(followForm).then((res) => {
					if (res.data.code === 0) {
						this.postDetail.isFollow = false;
					}
				});
			},
			previewImage(e) {
				uni.previewImage({
					current: e.currentTarget.dataset.current, // 当前显示图片的http链接
					urls: e.currentTarget.dataset.image // 需要预览的图片http链接列表
				});
			},

			// 点击评论回复
			replyToUser(nickName, pid) {
				this.placeholder = `回复 ${nickName}:`;
				this.form.pid = pid;
				this.focus = true;
			},

			// 点击子评论回复
			replyToCommentUser(userInfo, pid) {
				this.placeholder = `回复 ${userInfo.nickName}:`;
				this.form.pid = pid;
				this.form.toUid = userInfo.id;
				this.focus = true;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.post-title {
		font-size: 48rpx;
		// font-weight: 600;
		margin: 20rpx 0;
	}

	.detail-container {
		padding: 20rpx;
		background-color: #ffffff;
	}

	.icon text {
		font-size: 12px;
		color: #999;
		margin-right: 20rpx;
	}

	/*关注*/

	.user-item {
		display: flex;

		.vip-level-image{
			height: 50rpx; 
			width: 100rpx;
			display: flex;
			flex: 1;

			
			.image{
				height: 35rpx;
				width: 70rpx;
				padding-left: 20rpx;
				padding-top: 5rpx;
				padding-right: 15rpx;
				padding-bottom: 10rpx;
				margin-left: 5rpx;
				margin-top: 5rpx;
				align-items: center;
			}
		}

		.user-item-user {
			padding-left: 12rpx;
			// display: flex;
			// flex: 1;

			.userIntro {
				font-size: 12px;
				color: #999;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}

		image {
			width: 80rpx;
			height: 80rpx;
			float: left;
			margin-right: 10rpx;
			border-radius: 50%;
		}
	}

	.menu-container {
		margin: 30rpx;
		display: flex;
		font-size: 24rpx;
		color: #616161;
		justify-content: space-between;

		.left-section {
			display: flex;
			align-items: center;

			.p-item {
				display: flex;
				align-items: center;

				.iconfont {
					font-size: 40rpx;
				}

				&:nth-child(2) {
					margin: 0 20rpx;
				}

				.iconfont {
					margin-right: 10rpx;
				}
			}
		}

		.right-section {
			display: flex;
			align-items: center;

			.p-item {
				display: flex;
				align-items: center;

				.iconfont {
					font-size: 40rpx;
				}

				&:nth-child(2) {
					margin: 0 70rpx;
				}

				// &:nth-child(3) {
				// 	margin: 0 auto;
				// }

				.iconfont {
					margin-right: 10rpx;
				}
			}
		}


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



	// .comment-input {
	// 	position: fixed;
	// 	bottom: 0;
	// 	width: 100%;
	// 	background-color: #fff;
	// 	padding: 20rpx;
	// 	display: flex;
	// 	z-index: 999;
	// }
	// .comment-input textarea {
	// 	background-color: #f5f5f5;
	// 	padding: 20rpx;
	// 	border-radius: 10rpx;
	// 	min-height: 40rpx;
	// }
	// .comment-input .u-btn {
	// 	margin-left: 10rpx;
	// }
	// .emotion-container{
	// 	display: flex;
	// }

	.tabar_bottom {
		position: fixed;
		bottom: 0;
		z-index: 999;
		width: 100%;
		border-top: 1px solid #EEEEEE;
		background-color: #ffffff;
		box-sizing: border-box;

		.commentemoji {
			display: flex;

			.textarea {
				background-color: #f5f5f5;
				padding: 20rpx;
				// border-radius: 10rpx;
				min-height: 40rpx;
			}

			.emoji {
				display: flex;
				// margin-left: 4rpx;
				padding-right: 10rpx;
				background-color: #f5f5f5;

				.emojiIcon {
					display: flex;
					align-items: center;
				}
			}

			.sunbmit {
				margin-left: 10rpx;
			}
		}
	}








	.img-style-1 {
		display: block;
		width: 100%;
		max-height: 600rpx;
		border-radius: 5px;
	}

	.img-style-2 {
		display: flex;
	}

	.img-style-2 image {
		margin: 5rpx;
		border-radius: 5px;
		width: 100%;
		height: 294rpx;
	}

	.img-style-3 {
		display: flex;
		flex-wrap: wrap;
	}

	.img-style-3 image {
		width: 31.3%;
		height: 200rpx;
		margin: 1%;
		border-radius: 5px;
	}

	.img-style-4 {
		display: flex;
		flex-wrap: wrap;
	}

	.img-style-4 image {
		width: 48%;
		height: 320rpx;
		margin: 0.5%;
		border-radius: 5px;
	}


	// 分享弹窗
	.post-share-container {
		display: flex;
		padding: 30rpx;
		width: 60%;
		margin: 0 auto;

		.share-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&:nth-child(1) {
				margin-right: auto;
			}

			image {
				width: 100rpx;
				height: 100rpx;
			}

			text {
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}

		.share-item2 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&:nth-child(1) {
				margin: auto;
			}

			image {
				width: 100rpx;
				height: 100rpx;
			}

			text {
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}
	}


	video {
		width: 100%;
	}

	.post-text {
		white-space: pre-wrap;
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

				.nickName {
					// margin-right: 15rpx;
				}
				
				.level-icon{
					height: 27rpx;
					width: 60rpx;
					min-height: 27rpx;
					min-width: 60rpx;
					padding-top: 8rpx;
					padding-bottom: 8rpx;
					padding-left: 5rpx;
					padding-right: 5rpx;
				}

				.toUser-nickName {
					margin-left: 15rpx;
				}
			}
		}
	}
</style>