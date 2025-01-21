<script setup>
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import {useUserStore} from "@/store/user.js";
import { useRouter, useRoute } from 'vue-router';

const userStore = useUserStore()

const router = useRouter()

if (userStore.user.user_type === 'super_admin') {

} else if (userStore.user.user_type === 'admin') {

} else if (userStore.user.user_type === 'practitioner') {

} else if (userStore.user.user_type === 'practioner_admin') {

} else if (userStore.user.user_type === 'patient') {

} else {
    router.push('/auth/access')
}

</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <StatsWidget />

        <div class="col-span-12 xl:col-span-6">
            <RecentSalesWidget />
            <BestSellingWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <RevenueStreamWidget />
            <NotificationsWidget />
        </div>
    </div>
</template>
