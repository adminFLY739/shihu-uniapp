<template>
	<view>
		<post-list :list="postList" :loadStatus="loadStatus" @delPost="delPost" :userInfo="userInfo"></post-list>
	</view>
</template>

<script>
	import postList from '@/components/post-list/post-list.vue';
	import storage from "@/utils/storage.js";
	import {
		myPost,
		myCollectPost
	} from "@/api/bbs";
	export default {
		components: {
			postList
		},
		data() {
			return {
				postList: [],
				loadStatus: "loading",
				page: 1,
				type: 1, //1 点赞帖子   2 我的帖子
				userInfo: storage.getUserInfo()
			};
		},
		onLoad(options) {
			this.type = options.type
			if (options.type == 1) {
				this.getCollectPostList();
			} else if (options.type == 2) {
				this.getMyPostList();
			}
		},
		onReachBottom() {
			if (this.type == 1) {
				this.page++;
				this.getCollectPostList();
			} else if (this.type == 2) {
				this.page++;
				this.getMyPostList();
			}
		},
		methods: {
			getCollectPostList() {
				this.loadStatus = "loading";
				myCollectPost(this.page).then(res => {
					if (res.data.result.data) {
						this.postList = this.postList.concat(res.data.result.data);
						if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page ===
							0) {
							this.loadStatus = "nomore";
						} else {
							this.loadStatus = "loadmore"
						}
					} else {
						this.loadStatus = "nomore";
					}
				})
			},
			delPost() {
				this.page = 1;
				this.postList = [];
				this.getMyPostList();
			},
			getMyPostList() {
				this.loadStatus = "loading";
				myPost(this.page).then(res => {
					this.postList = this.postList.concat(res.data.result.data);
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}
</style>