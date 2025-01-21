<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

var links = [
   
];

links.push({
    label: 'Admin',
    items: [{ label: 'Users', icon: 'pi pi-fw pi-user', to: '/users/manage' }]
});


links.push({
    label: 'Users', icon: 'pi pi-fw pi-user', to: '/users/manage'
});

// if (userStore.user.user_type === 'super_admin') {

// } else if (userStore.user.user_type === 'admin') {

// } else if (userStore.user.user_type === 'practitioner') {

// } else if (userStore.user.user_type === 'practioner_admin') {

// } else if (userStore.user.user_type === 'patient') {

// } else {
//     router.push('/auth/access')
// }

const model = ref(links);

</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
