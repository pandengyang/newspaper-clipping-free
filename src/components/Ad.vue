<script setup>
import scratchlab from '../assets/images/scratchlab.jpg'
</script>

<template>
  <div class="ad">
    <el-avatar shape="square" class="qrcode" :src="scratchlab" />

    <div class="tip">
      微信公众号：专注创作有助于理解CPU体系结构、虚拟化的文章。
    </div>
  </div>
</template>

<style scoped>
.ad {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.qrcode {
  width: 160px;
  height: 160px;
}

.tip {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
}
</style>
