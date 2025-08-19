const routes = [
    {
        path: '/',
        redirect: 'home',
        component: () => import('layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'home',
                name: 'home',
                props: true,
                component: () => import('src/pages/HomePage.vue')
            },
            {
                path: 'my-account',
                name: 'myAccount',
                props: true,
                component: () => import('src/pages/MyAccount.vue')
            },
            {
                path: 'users',
                name: 'users',
                component: () => import('src/pages/UsersPage.vue')
            },
            {
                path: 'users-form/:id?',
                name: 'usersForm',
                component: () => import('src/pages/UsersForm.vue')
            },
            {
                path: 'roles',
                name: 'roles',
                component: () => import('src/pages/RolesPage.vue')
            },
            {
                path: 'roles-form/:id?',
                name: 'rolesForm',
                component: () => import('src/pages/RolesForm.vue')
            },
            {
                path: 'menus',
                name: 'menus',
                component: () => import('src/pages/MenusPage.vue')
            },
            {
                path: 'menus-form/:id?',
                name: 'menusForm',
                component: () => import('src/pages/MenusForm.vue')
            },
            {
                path: 'squads',
                name: 'squads',
                component: () => import('src/pages/SquadsPage.vue')
            },
            {
                path: 'squads-form/:id?',
                name: 'squadsForm',
                component: () => import('src/pages/SquadsForm.vue')
            },
            {
                path: 'employees',
                name: 'employees',
                component: () => import('src/pages/EmployeesPage.vue')
            },
            {
                path: 'employees-form/:id?',
                name: 'employeesForm',
                component: () => import('src/pages/EmployeesForm.vue')
            },
            {
                path: 'sprints',
                name: 'sprints',
                component: () => import('src/pages/SprintsPage.vue')
            },
            {
                path: 'sprints-form/:id?',
                name: 'sprintsForm',
                component: () => import('src/pages/SprintsForm.vue')
            },
            {
                path: 'metrics',
                name: 'metrics',
                component: () => import('src/pages/MetricsPage.vue')
            },

        ]
    },
    {
        path: '/login',
        redirect: 'login',
        component: () => import('layouts/LoginLayout.vue'),
        children: [
            {
                path: '/login',
                name: 'login',
                component: () => import('pages/Login.vue')
            },
            {
                path: 'esqueci-minha-senha',
                name: 'esqueciSenha',
                component: () => import('pages/EsqueciSenha.vue')
            }
        ]
    },

    // Always leave this as last one, but you can also remove it.
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
]

export default routes
