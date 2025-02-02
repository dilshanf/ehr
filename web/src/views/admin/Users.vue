
<template>
	<div class="card p-fluid">

        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                <Button label="Disable" icon="pi pi-trash" severity="secondary" @click="confirmDisableSelected" :disabled="!selectedUsers || !selectedUsers.length" />
            </template>

            <template #end>
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>

        <DataTable :value="customers" lazy paginator :first="first" :rows="10" v-model:filters="filters" ref="dt" dataKey="id"
            :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)" filterDisplay="row"
            :globalFilterFields="['name', 'email', 'user_type']"
            v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect" tableStyle="min-width: 75rem">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="name" header="Name" filterMatchMode="startsWith" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="email" header="Email" filterField="email" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <span>{{ data.email }}</span>
                    </div>
                </template>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="user_type" header="User Type" filterField="user_type" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <span>{{ data.user_type }}</span>
                    </div>
                </template>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
        </DataTable>

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

<script setup>
import { ref, onMounted } from 'vue';
import { UserService } from '@/service/UserService';

onMounted(() => {
    loading.value = true;

    lazyParams.value = {
        first: 0,
        rows: 10,
        sortField: null,
        sortOrder: null,
        filters: filters.value
    };

    loadLazyData();
});

const dt = ref();
const loading = ref(false);
const totalRecords = ref(0);
const customers = ref();
const user = ref({});
const submitted = ref(false);
const userDialog = ref(false);
const selectedCustomers = ref();
const selectAll = ref(false);
const first = ref(0);
const filters = ref({
    'name': {value: '', matchMode: 'contains'},
    'email': {value: '', matchMode: 'contains'},
    'user_type': {value: '', matchMode: 'contains'},
});
const lazyParams = ref({});
const columns = ref([
    {field: 'name', header: 'Name'},
    {field: 'email', header: 'Email'},
    {field: 'user_type', header: 'Type'}
]);

const loadLazyData = (event) => {
    loading.value = true;
    lazyParams.value = { ...lazyParams.value, first: event?.first || first.value };

    setTimeout(() => {
        UserService.getUsers({ lazyEvent: JSON.stringify(lazyParams.value) }).then((data) => {
            console.log(data)
            customers.value = data;
            totalRecords.value = 150;
            loading.value = false;
        });
    }, Math.random() * 1000 + 250);
};
const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData(event);
};
const onSort = (event) => {
    lazyParams.value = event;
    loadLazyData(event);
};
const onFilter = (event) => {
    lazyParams.value.filters = filters.value ;
    loadLazyData(event);
};
const onSelectAllChange = (event) => {
    selectAll.value = event.checked;

    if (selectAll) {
        CustomerService.getCustomers().then(data => {
            selectAll.value = true;
            selectedCustomers.value = data.customers;
        });
    }
    else {
        selectAll.value = false;
        selectedCustomers.value = [];
    }
};
const onRowSelect = () => {
    selectAll.value = selectedCustomers.value.length === totalRecords.value;
};
const onRowUnselect = () => {
    selectAll.value = false;
};


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
            customers.value[findIndexById(user.value.id)] = user.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        } else {
            user.value.id = createId();
            user.value.code = createId();
            user.value.image = 'product-placeholder.svg';
            user.value.inventoryStatus = user.value.inventoryStatus ? user.value.inventoryStatus.value : 'INSTOCK';
            customers.value.push(user.value);
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
    customers.value = customers.value.filter((val) => val.id !== user.value.id);
    disableUserDialog.value = false;
    user.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'User Disabled', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < customers.value.length; i++) {
        if (customers.value[i].id === id) {
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
    customers.value = customers.value.filter((val) => !selectedUsers.value.includes(val));
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
