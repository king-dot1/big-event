import request from '@/utils/request'

// 分类 -获取文章分类
export const ArticleListService = () => request.get('/my/cate/list')

// 分类 -添加文章分类
export const ArticleAddService = ({ cate_name, cate_alias }) =>
  request.post('/my/cate/add', { cate_name, cate_alias })

// 分类 -编辑文章分类
export const ArticleEditService = ({ id, cate_name, cate_alias }) =>
  request.put('/my/cate/info', { id, cate_name, cate_alias })

// 分类 -删除文章分类
export const ArticleDeleteService = (id) =>
  request.delete('/my/cate/del', { params: { id } })

// 管理 -获取文章列表
export const ArticleManageListService = (params) =>
  request.get('/my/article/list', { params })

// 管理 -发布文章
export const ArticlePublishService = (data) =>
  request.post('/my/article/add', data)

// 管理 -获取文章详情
export const ArticleInfoService = (id) =>
  request.get('/my/article/info', { params: { id } })

// 管理 -更新文章详情
export const ArticleUpdateService = (data) =>
  request.put('/my/article/info', data)

// 管理 -删除文章
export const ArticleDeleteByIdService = (id) =>
  request.delete('/my/article/info', { params: { id } })
