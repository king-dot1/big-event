// 日期格式化
import { dayjs } from 'element-plus'

export const formatDate = (item) => dayjs(item).format('YYYY-MM-DD HH:mm:ss')
