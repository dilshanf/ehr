<script setup>
import { UserService } from '@/service/UserService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { getUsers } from '@/service/ApiService';

onMounted(() => {
    UserService.getUsers().then((data) => (users.value = data));
});

const response = await getUsers();
console.log(response)

const toast = useToast();
const dt = ref();
const users = ref();
const userDialog = ref(false);
const disableUserDialog = ref(false);
const disableUsersDialog = ref(false);
const user = ref({});
const selectedUsers = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
}

function openNew() {
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
}

function hideDialog() {
    userDialog.value = false;
    submitted.value = false;
}

function saveUser() {
    submitted.value = true;

    if (user?.value.name?.trim()) {
        if (user.value.id) {
            user.value.inventoryStatus = user.value.inventoryStatus.value ? user.value.inventoryStatus.value : user.value.inventoryStatus;
            users.value[findIndexById(user.value.id)] = user.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        } else {
            user.value.id = createId();
            user.value.code = createId();
            user.value.image = 'product-placeholder.svg';
            user.value.inventoryStatus = user.value.inventoryStatus ? user.value.inventoryStatus.value : 'INSTOCK';
            users.value.push(user.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
        }

        userDialog.value = false;
        user.value = {};
    }
}

function editUser(prod) {
    user.value = { ...prod };
    userDialog.value = true;
}

function confirmDisableUser(prod) {
    user.value = prod;
    disableUserDialog.value = true;
}

function disableUser() {
    users.value = users.value.filter((val) => val.id !== user.value.id);
    disableUserDialog.value = false;
    user.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'User Disabled', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < users.value.length; i++) {
        if (users.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function exportCSV() {
    dt.value.exportCSV();
}

function confirmDisableSelected() {
    disableUsersDialog.value = true;
}

function disableSelectedUsers() {
    users.value = users.value.filter((val) => !selectedUsers.value.includes(val));
    disableUsersDialog.value = false;
    selectedUsers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Disabled', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Disable" icon="pi pi-trash" severity="secondary" @click="confirmDisableSelected" :disabled="!selectedUsers || !selectedUsers.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedUsers"
                :value="users"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Users</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="email" header="Email" sortable style="min-width: 12rem"></Column>
                <Column field="user_type" header="Type" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDisableUser(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="User Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="user.image" :src="`https://primefaces.org/cdn/primevue/images/product/${user.image}`" :alt="user.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus :invalid="submitted && !user.name" fluid />
                    <small v-if="submitted && !user.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="user_type" class="block font-bold mb-3">Type</label>
                    <Select id="user_type" v-model="user.user_type" :options="statuses" optionLabel="label" placeholder="Select a type" fluid></Select>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveUser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="disableUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="user"
                    >Are you sure you want to disable <b>{{ user.email }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="disableUserDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="disable" />
            </template>
        </Dialog>

        <Dialog v-model:visible="disableUsersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="user">Are you sure you want to disable the selected users?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="disableUsersDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="disableSelectedUsers" />
            </template>
        </Dialog>
    </div>
</template>
