
import {http, Method} from '@/utils/request.js';

/**
 * 最新动态列表
 * @param params
 */
export function lastPost(params,classId) {
    return http.request({
        url: `/bbs/post/lastPost/${params}/${classId}`,
        method: Method.GET,
    });
}

/**
 * 关注帖子
 * @param params
 */
export function followUserPost(params) {
    return http.request({
        url: `/bbs/post/followUserPost/${params}`,
        method: Method.GET,
    });
}

/**
 * 分页获得帖子
 */
export function getPostList(params) {
    return http.request({
        url: `/bbs/post/list`,
        method: Method.POST,
        data:params
    });
}




/**
 * 发帖
 */
export function addPost(params) {
    return http.request({
        url: `/bbs/post/addPost`,
        method: Method.POST,
        data:params
    });
}

/**
 * 更新帖子
 */
export function updatePost(params) {
    return http.request({
        url: `/bbs/post/updatePost`,
        method: Method.POST,
        data:params
    });
}

/**
 * 发布话题
 */
export function addDiscuss(params) {
    return http.request({
        url: `/bbs/discuss/addDiscuss`,
        method: Method.POST,
        data:params
    });
}

/**
 * 更新话题
 */
export function updateDiscuss(params) {
    return http.request({
        url: `/bbs/discuss/updateDiscuss`,
        method: Method.POST,
        data:params
    });
}


/**
 * 分类列表
 * @param params
 */
export function classList(params) {
    return http.request({
        url: `/bbs/topic/classList`,
        method: Method.GET,
    });
}

/**
 * 获取帖子
 * @param params
 */
export function postDetail(params) {
    return http.request({
        url: `/bbs/post/detail/${params}`,
        method: Method.GET,
    });
}

/**
 * 获取帖子评论
 * @param params
 */
export function commitList(postId,page) {
    return http.request({
        url: `/bbs/comment/list/${postId}/${page}`,
        method: Method.GET,
    });
}

/**
 * 获取话题评论
 * @param params
 */
export function commentDiscussList(discussId,page) {
    return http.request({
        url: `/bbs/commentDiscuss/list/${discussId}/${page}`,
        method: Method.GET,
    });
}

/**
 * 收藏帖子
 */
export function addCollection(params) {
    return http.request({
        url: `/bbs/post/addCollection`,
        method: Method.POST,
        data:params
    });
}

/**
 * 取消收藏帖子
 */
export function cancelCollection(params) {
    return http.request({
        url: `/bbs/post/cancelCollection`,
        method: Method.POST,
        data:params
    });
}

/**
 * 点赞帖子
 */
export function addPostThumb(params) {
    return http.request({
        url: `/bbs/post/addPostThumb`,
        method: Method.POST,
        data:params
    });
}

/**
 * 取消点赞帖子
 */
export function cancelPostThumb(params) {
    return http.request({
        url: `/bbs/post/cancelPostThumb`,
        method: Method.POST,
        data:params
    });
}

/**
 * 反对帖子
 */
export function addPostOppose(params) {
    return http.request({
        url: `/bbs/post/addPostOppose`,
        method: Method.POST,
        data:params
    });
}

/**
 * 取消反对帖子
 */
export function cancelPostOppose(params) {
    return http.request({
        url: `/bbs/post/cancelPostOppose`,
        method: Method.POST,
        data:params
    });
}

/**
 * 关注用户
 */
export function addFollow(params) {
    return http.request({
        url: `/bbs/user/addFollow`,
        method: Method.POST,
        data:params
    });
}

/**
 * 取消关注用户
 */
export function cancelFollow(params) {
    return http.request({
        url: `/bbs/user/cancelFollow`,
        method: Method.POST,
        data:params
    });
}

/**
 * 关注问题
 */
export function addFollowDiscuss(params) {
    return http.request({
        url: `/bbs/discuss/addFollowDiscuss`,
        method: Method.POST,
        data:params
    });
}

/**
 * 取消关注问题
 */
export function cancelFollowDiscuss(params) {
    return http.request({
        url: `/bbs/discuss/cancelFollowDiscuss`,
        method: Method.POST,
        data:params
    });
}

/**
 * 获取推荐用户列表
 */
export function getUserRecommendList(params) {
    return http.request({
        url: `/bbs/user/userRecommendList`,
        method: Method.POST,
		data:params
    });
}

/**
 * 获取用户信息
 */
export function userInfoById(params) {
    return http.request({
        url: `/bbs/user/userInfoById`,
        method: Method.POST,
        data:params
    });
}

/**
 * 获取个人用户信息
 */
export function userInfo() {
    return http.request({
        url: `/bbs/user/userInfo`,
        method: Method.GET,
    });
}

/**
 * 获取粉丝列表
 */
export function userFans(params) {
    return http.request({
        url: `/bbs/user/userFans/${params}`,
        method: Method.GET,
    });
}

/**
 * 获取关注列表
 */
export function userFollow(params) {
    return http.request({
        url: `/bbs/user/follow/${params}`,
        method: Method.GET,
    });
}

/**
 * 获取帖子列表
 */
export function myPost(params) {
    return http.request({
        url: `/bbs/post/myPost/${params}`,
        method: Method.GET,
    });
}

/**
 * 获取点赞列表
 */
export function myCollectPost(params) {
    return http.request({
        url: `/bbs/post/myCollectPost/${params}`,
        method: Method.GET,
    });
}

/**
 * 获取评论转发消息列表
 */
export function getCommentMessage(params) {
    return http.request({
        url: `/bbs/message/comment/${params}`,
        method: Method.GET,
    });
}


/**
 * 更新消息为已读
 */
export function updateCommentMessagesAsRead(params) {
    return http.request({
        url: `/bbs/message/comment/updateCommentMessagesAsRead`,
        method: Method.POST,
        data: params
    });
}

/**
 * 获取赞同喜欢消息列表
 */
export function getEndorseMessage(params) {
    return http.request({
        url: `/bbs/message/endorse/${params}`,
        method: Method.GET,
    });
}


/**
 * 更新消息为已读
 */
export function updateEndorseMessagesAsRead(params) {
    return http.request({
        url: `/bbs/message/endorse/updateEndorseMessagesAsRead`,
        method: Method.POST,
        data: params
    });
}

/**
 * 获取收藏了我消息列表
 */
export function getCollectMessage(params) {
    return http.request({
        url: `/bbs/message/collect/${params}`,
        method: Method.GET,
    });
}

/**
 * 更新消息为已读
 */
export function updateCollectMessagesAsRead(params) {
    return http.request({
        url: `/bbs/message/collect/updateCollectMessagesAsRead`,
        method: Method.POST,
        data: params
    });
}


/**
 * 获取关注了我消息列表
 */
export function getFollowMessage(params) {
    return http.request({
        url: `/bbs/message/follow/${params}`,
        method: Method.GET,
    });
}

/**
 * 更新消息为已读
 */
export function updateFollowMessagesAsRead(params) {
    return http.request({
        url: `/bbs/message/follow/updateFollowMessagesAsRead`,
        method: Method.POST,
        data: params
    });
}



/**
 * 获取未读消息数量
 */
export function getMessageNoReadCount(params) {
    return http.request({
        url: `/bbs/message/messageNoReadCount`,
        method: Method.GET,
    });
}

/**
 * 获取总未读消息数量
 */
export function getAllMessageNoReadCount(params) {
    return http.request({
        url: `/bbs/message/allMessageNoReadCount`,
        method: Method.GET,
    });
}

/**
 * 获取邀请回答消息列表
 */
export function getInviteMessageList(params) {
    return http.request({
        url: `/bbs/message/invite/${params}`,
        method: Method.GET,
    });
}

/**
 * 更新消息为已读
 */
export function updateInviteMessagesAsRead(params) {
    return http.request({
        url: `/bbs/message/invite/updateInviteMessagesAsRead`,
        method: Method.POST,
        data: params
    });
}






/**
 * 发布帖子评论
 */
export function addComment(params) {
    return http.request({
        url: `/bbs/post/addComment`,
        method: Method.POST,
        data:params
    });
}

/**
 * 发布话题评论
 */
export function addCommentDiscuss(params) {
    return http.request({
        url: `/bbs/discuss/addCommentDiscuss`,
        method: Method.POST,
        data:params
    });
}

/**
 * 删除帖子评论
 */
export function delComment(params) {
    return http.request({
        url: `/bbs/post/delComment`,
        method: Method.POST,
        data:params
    });
}

/**
 * 删除话题评论
 */
export function delCommentDiscuss(params) {
    return http.request({
        url: `/bbs/discuss/delCommentDiscuss`,
        method: Method.POST,
        data:params
    });
}

/**
 * 帖子评论点赞
 */
export function onThumbs(params) {
    return http.request({
        url: `/bbs/comment/thumbs`,
        method: Method.POST,
        data:params
    });
}

/**
 * 帖子评论取消点赞
 */
export function cancelThumbs(params) {
    return http.request({
        url: `/bbs/comment/cancelThumbs`,
        method: Method.POST,
        data:params
    });
}

/**
 * 话题评论点赞
 */
export function onCommentDiscussThumbs(params) {
    return http.request({
        url: `/bbs/commentDiscuss/thumbs`,
        method: Method.POST,
        data:params
    });
}

/**
 * 话题评论取消点赞
 */
export function cancelCommentDiscussThumbs(params) {
    return http.request({
        url: `/bbs/commentDiscuss/cancelThumbs`,
        method: Method.POST,
        data:params
    });
}

/**
 * 删除帖子
 */
export function delPost(params) {
    return http.request({
        url: `/bbs/post/delPost`,
        method: Method.POST,
        data:params
    });
}



/**
 * 获取话题列表
 */
export function lastDiscuss(params) {
    return http.request({
        url: `/bbs/discuss/lastDiscuss/${params}`,
        method: Method.GET,
    });
}

/**
 * 获取话题详情
 * @param params
 */
export function discussDetail(params) {
    return http.request({
        url: `/bbs/discuss/detail/${params}`,
        method: Method.GET,
    });
}


/**
 * 获取关注的话题
 * @param params
 */
export function followDiscuss(params) {
    return http.request({
        url: `/bbs/discuss/myFollowDiscuss/${params}`,
        method: Method.GET,
    });
}


/**
 * 邀请回答
 */
export function inviteReply(params) {
    return http.request({
        url: `/bbs/message/inviteReply`,
        method: Method.POST,
        data:params
    });
}


/**
 * 获取每日任务
 */
export function getTaskList(params) {
    return http.request({
        url: `/bbs/task/getTaskList`,
        method: Method.GET,
    });
}
