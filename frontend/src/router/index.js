import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Articles from '../views/Articles.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import Categories from '../views/Categories.vue'
import CategoryDetail from '../views/CategoryDetail.vue'
import Tags from '../views/Tags.vue'
import TagDetail from '../views/TagDetail.vue'
import Talks from '../views/Talks.vue'
import TalkDetail from '../views/TalkDetail.vue'
import Archives from '../views/Archives.vue'
import About from '../views/About.vue'
import Links from '../views/Links.vue'
import AddArticle from '../views/AddArticle.vue'
import Resume from '../views/Resume.vue'
import Projects from '../views/Projects.vue'
import Skills from '../views/Skills.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles,
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
  },
  {
    path: '/articles/add',
    name: 'AddArticle',
    component: AddArticle,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
  },
  {
    path: '/categories/:id',
    name: 'CategoryDetail',
    component: CategoryDetail,
  },
  {
    path: '/tags',
    name: 'Tags',
    component: Tags,
  },
  {
    path: '/tags/:id',
    name: 'TagDetail',
    component: TagDetail,
  },
  {
    path: '/talks',
    name: 'Talks',
    component: Talks,
  },
  {
    path: '/talks/:id',
    name: 'TalkDetail',
    component: TalkDetail,
  },
  {
    path: '/archives',
    name: 'Archives',
    component: Archives,
  },
  {
    path: '/resume',
    name: 'Resume',
    component: Resume,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/skills',
    name: 'Skills',
    component: Skills,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/links',
    name: 'Links',
    component: Links,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
