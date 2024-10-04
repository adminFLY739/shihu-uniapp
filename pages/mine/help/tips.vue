<template>
  <div class="wrapper">
    <u-parse :show-with-animation="true" :lazy-load="true" :selectable="true" :html="res.content" v-if="res"></u-parse>
  </div>
</template>
<script>
import { getArticleDetailByType } from "@/api/article";
import storage from "@/utils/storage";
export default {
  data() {
    return {
      res: "",
      way: {
        USER_AGREEMENT: {
          title: "服务协议",
          type: "USER_AGREEMENT",
        },
        PRIVACY_POLICY: {
          title: "隐私政策",
          type: "PRIVACY_POLICY",
        },
        LICENSE_INFORMATION: {
          title: "证照信息",
          type: "LICENSE_INFORMATION",
        },
        ABOUT: {
          title: "关于我们",
          type: "ABOUT",
        },
      },
    };
  },
  mounted() {},
  onLoad(option) {
    console.log(this.way)
    uni.setNavigationBarTitle({
      title: this.way[option.type].title,
    });
    this.init(option);
  },

  methods: {
    init(option) {
      let tenantId
      if(storage.getMainTenant()){
        tenantId=storage.getMainTenant();
      }else{
        tenantId={tenantId:'0'};
      }
      getArticleDetailByType(this.way[option.type].type,tenantId).then((res) => {
        if (res.data.success) {
          this.res = res.data.result;
          console.log(res)
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 16rpx;
}
</style>
