<template>
  <div className="nothing-page flex-row">
    <img className="run-img" src="@/assets/images/web404.svg" />
    <div className="right-info">
      <h1>Oops！Error <span>404</span>…</h1>
      <p>We are sorry , the page you resquested cannot be found.</p>
      <a-button type="primary" @click="GoHome">返回首页</a-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter()
    const GoHome = () => {
      router.push({path: '/'})
    };

    return {
      GoHome,
    };
  },
});
</script>

<style lang="less" scoped>
.nothing-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .run-img {
    border-radius: 20px;
    // box-shadow: rgba(0, 0, 0, 0.08) 0px 6px 16px -8px,
    //   rgba(0, 0, 0, 0.05) 0px 9px 28px 0px,
    //   rgba(0, 0, 0, 0.03) 0px 12px 48px 16px;
  }

  .right-info {
    flex: 0 0 337px;
    width: 337px;
    overflow: hidden;
    margin-left: 40px;

    h1 {
      font-size: 60px;
      color: #000;
      line-height: 70px;
      font-weight: bold;
    }

    p {
      font-size: 18px;
      color: #000;
      line-height: 30px;
      margin-top: 20px;
    }
  }
}

.no-data-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
}
</style>