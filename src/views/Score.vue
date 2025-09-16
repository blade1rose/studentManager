<template>
  <el-container class="container">
    <el-header class="header">
      <h1>学生考试成绩查询</h1>
      <div class="stats">
        <el-tag type="success">共 {{ scores.length }} 条记录</el-tag>
        <el-tag>平均分: {{ averageScore.toFixed(2) }}</el-tag>
        <el-tag type="danger">最高分: {{ maxScore }}</el-tag>
      </div>
      <el-button 
        type="danger" 
        class="logout-button" 
        @click="logout">
        退出登录
      </el-button>
    </el-header>

    <el-main>
      <div class="toolbar">
        <el-input
          v-model="searchText"
          placeholder="输入学号、姓名或考试名称查询"
          clearable
          @input="filterScores"
          class="search-input">
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
        
        <el-select 
          v-model="selectedExam" 
          placeholder="选择考试"
          clearable
          @change="filterScores"
          class="exam-select">
          <el-option
            v-for="exam in uniqueExams"
            :key="exam"
            :label="exam"
            :value="exam">
          </el-option>
        </el-select>
      </div>

      <el-table 
        :data="filteredScores" 
        stripe 
        height="500"
        v-loading="loading"
        class="score-table">
        <el-table-column prop="studentId" label="学号" width="120" sortable />
        <el-table-column prop="studentName" label="姓名" width="120" />
        <el-table-column prop="examName" label="考试名称" width="200">
          <template #default="scope">
            <el-tag type="success" effect="dark">
              {{ scope.row.examName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="分数" width="120" sortable>
          <template #default="scope">
            <span :class="scoreClass(scope.row.score)">
              {{ scope.row.score }} 
              <el-tooltip v-if="scope.row.score >= 90" content="优秀" placement="top">
                <el-icon color="#67c23a"><star-filled /></el-icon>
              </el-tooltip>
              <el-tooltip v-else-if="scope.row.score < 60" content="需努力" placement="top">
                <el-icon color="#f56c6c"><warning-filled /></el-icon>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="viewDetail(scope.row)"
              icon="el-icon-view">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { StarFilled, WarningFilled } from '@element-plus/icons-vue';

const router = useRouter();
const scores = ref([]);
const loading = ref(true);
const searchText = ref('');
const selectedExam = ref('');
const filteredScores = ref([]);

// 从后端获取成绩数据
const fetchScores = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/auth/score');
    scores.value = response.data;
    filteredScores.value = [...scores.value];
    ElMessage.success('成绩数据加载成功');
  } catch (error) {
    console.error('获取成绩数据失败:', error);
    ElMessage.error('获取成绩数据失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 登出功能
const logout = () => {
  sessionStorage.removeItem('isAuthenticated');
  router.push('/login');
  ElMessage.success('已退出登录');
};

// 计算属性
const uniqueExams = computed(() => {
  const exams = new Set();
  scores.value.forEach(item => exams.add(item.examName));
  return [...exams];
});

const averageScore = computed(() => {
  if (scores.value.length === 0) return 0;
  const total = scores.value.reduce((sum, item) => sum + item.score, 0);
  return total / scores.value.length;
});

const maxScore = computed(() => {
  if (scores.value.length === 0) return 0;
  return Math.max(...scores.value.map(item => item.score));
});

// 过滤成绩数据
const filterScores = () => {
  const search = searchText.value.toLowerCase();
  filteredScores.value = scores.value.filter(score => {
    const matchesSearch = 
      (score.studentId && score.studentId.toString().includes(search)) ||
      (score.studentName && score.studentName.toLowerCase().includes(search)) ||
      (score.examName && score.examName.toLowerCase().includes(search));
    
    const matchesExam = 
      selectedExam.value === '' || 
      score.examName === selectedExam.value;
    
    return matchesSearch && matchesExam;
  });
};

// 查看详情
const viewDetail = (score) => {
  ElMessageBox.alert(
    `<div class="detail-content">
       <div class="detail-item"><span class="detail-label">学号:</span> ${score.studentId}</div>
       <div class="detail-item"><span class="detail-label">姓名:</span> ${score.studentName}</div>
       <div class="detail-item"><span class="detail-label">考试名称:</span> ${score.examName}</div>
       <div class="detail-item"><span class="detail-label">分数:</span> <span class="score-display ${scoreClass(score.score)}">${score.score}</span></div>
     </div>`,
    '成绩详情',
    {
      dangerouslyUseHTMLString: true,
      customClass: 'score-detail'
    }
  );
};

// 辅助函数
const scoreClass = (score) => {
  if (score >= 90) return 'high-score';
  if (score >= 60) return 'medium-score';
  return 'low-score';
};

onMounted(() => {
  fetchScores();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.header h1 {
  margin: 0;
  font-weight: 500;
}

.stats {
  display: flex;
  gap: 10px;
}

.stats .el-tag {
  font-size: 16px;
  padding: 5px 15px;
  border-radius: 20px;
}

.logout-button {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.toolbar {
  display: flex;
  margin-bottom: 20px;
  gap: 15px;
}

.search-input {
  flex: 1;
}

.exam-select {
  width: 250px;
}

.score-table {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.high-score {
  color: #67c23a;
  font-weight: bold;
}

.medium-score {
  color: #e6a23c;
  font-weight: bold;
}

.low-score {
  color: #f56c6c;
  font-weight: bold;
}

:deep(.el-table .cell) {
  padding: 0 10px;
}

:deep(.score-detail .el-message-box__content) {
  font-size: 16px;
  padding: 20px;
}

:deep(.detail-content) {
  display: grid;
  gap: 15px;
}

:deep(.detail-item) {
  display: flex;
}

:deep(.detail-label) {
  font-weight: bold;
  width: 80px;
  color: #606266;
}

:deep(.score-detail .score-display) {
  font-size: 24px;
  font-weight: bold;
}

:deep(.score-display.high-score) {
  color: #67c23a;
}

:deep(.score-display.medium-score) {
  color: #e6a23c;
}

:deep(.score-display.low-score) {
  color: #f56c6c;
}
</style>
