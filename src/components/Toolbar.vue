<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Scissor } from '@element-plus/icons-vue'

const switchNewspaperClippingModeTitle = chrome.i18n.getMessage(
  'switchNewspaperClippingMode'
)
const undoTitle = chrome.i18n.getMessage('undo')
const undoTip = chrome.i18n.getMessage('undoTip')

const mode = ref(null)
const newspaperClippingMode = computed(() => {
  return 'newspaper-clipping' === mode.value
})

function switchNewspaperClippingMode(value) {
  let newMode = value ? 'newspaper-clipping' : null

  console.log('mode: ' + mode.value)
  console.log('newMode: ' + newMode)

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          target: 'CONTENT',
          method: 'put',
          res: 'mode',
          data: newMode,
        },
        function (response) {
          console.log(response)
          mode.value = response.mode
          window.close()
        }
      )
    }
  )
}

function undo() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          target: 'CONTENT',
          method: 'post',
          res: 'undo',
        },
        function (response) {
          console.log(response)
          if (!response.undo) {
            ElMessage.error(undoTip)
          }
        }
      )
    }
  )
}

chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },
  (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        target: 'CONTENT',
        method: 'get',
        res: 'mode',
      },
      (response) => {
        console.log(response)
        mode.value = response.mode
      }
    )
  }
)
</script>

<template>
  <div class="toolbar">
    <div class="toolgroup">
      <el-switch
        v-model="newspaperClippingMode"
        @change="switchNewspaperClippingMode"
        style="--el-switch-on-color: #d4237a"
        :active-action-icon="Scissor"
        :inactive-action-icon="Scissor"
        size="large"
        class="tool"
        :title="switchNewspaperClippingModeTitle"
      />

      <el-button
        @click="undo"
        circle
        text
        size="small"
        :title="undoTitle"
        class="tool"
      >
        <el-icon class="element-icons el-icon-chexiao"></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  margin-top: 30px;
  padding: 10px 10px;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  background-color: #ffffff;
}

.toolgroup {
  padding: 0 5px;
}

.tool {
  margin: 3px;
}
</style>
