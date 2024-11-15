const warehouse_info = async (role, page, warehouse_id) => {
  
  try {
    if (role == "admin") {

      const response = await fetch("/api/manage/warehouses/")

      if (!response.ok) {
        DisplayMessage("An error occured while loadin store information", "error")
        return 
      }
  
      const data = await response.json()
      const results = data.results

      let warehouses = `<div class="items-center rounded-lg p-4 shadow grid grid-flow-row h-[40vh] overflow-y-auto">
          <dl>
            <button type="button" data-modal-target="store_create_modal" data-modal-toggle="store_create_modal" class="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto">
              <svg class="-ms-0.5 me-1.5 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
              </svg>
              Create Store
            </button>
          </dl>
          <dl id="store_create_modal" tabindex="-1" aria-hidden="true" class="max-h-auto fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden antialiased md:inset-0">
            <div class="max-h-auto relative max-h-full w-full max-w-lg p-4">
              <!-- Modal content -->
              <div class="relative rounded-lg bg-white shadow dark:bg-gray-800">
                <!-- Modal header -->
                <div class="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Store Information</h3>
                  <button type="button" class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="store_create_modal">
                    <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                </div>
                <!-- Modal body -->
                <form onsubmit="createStore(event)" class="p-4 md:p-5">
                  <div class="mb-5 grid grid-cols-1 gap-4">

                    <div>
                      <label for="store_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store Name* </label>
                      <input type="text" id="store_name" 
                        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                        placeholder="Enter store Name" required />
                    </div>

                    <div>
                      <label for="store_email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store Email* </label>
                      <input type="text" id="store_email" 
                        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                        placeholder="Enter store Email"/>
                    </div>

                    <div>
                      <label for="store_phone_number" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store Phone Number* </label>
                      <div class="flex items-center">
                        <div class="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                          +234
                        </div>
                        <div class="relative w-full">
                          <input type="text" id="store_phone_number" 
                            class="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500" 
                            pattern="[0-9]{3} [0-9]{3} [0-9]{4}" title="Number Format 123 456 7890" placeholder="123 456 7890"/>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label for="store_address" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store Address* </label>
                      <input type="text" id="store_address" 
                        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                        placeholder="Enter store Address" required />
                    </div>
                  
                    <div class="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
                      <button type="submit" class="me-2 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save information</button>
                      <button type="button" data-modal-toggle="store_create_modal" class="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Cancel</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </dl>`;
      
      for (let warehouse of results) {
        let store_status = ``
        if (warehouse.is_active) {
          store_status = `
            <span class="inline-block rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> Active </span>
            `
          if (warehouse.id == warehouse_id) {
            store_status += `<span class="inline-block rounded border border-primary-100 dark:border-primary-900 bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> Selected </span>`
          }else {
            store_status += `<button onclick="selectWarehouse('${role}', ${warehouse.id})" class="inline-block rounded-lg  border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"> select </button>`
          }
        } else {
          store_status = `<span class="inline-block rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300 "> Not Active </span>`
        }
        

        
        warehouses += `
          <dl class="p-5 grid grid-flow-row">
              <div>
                <dt class="flex flex-row gap-2 items-center">
                  <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    ${warehouse.name}
                  </h3>
                  ${store_status}
                </dt>

                <dd class="flex flex-wrap items-center gap-2">
                  <span class="text-gray-500 dark:text-gray-400">${warehouse.email? warehouse.email : 'companyEmail@company.ng'}</span>
                  <span class="text-gray-500 dark:text-gray-400">+234 ${warehouse.phone_number? warehouse.phone_number : '000 000 0000'}</span>
                </dd>
                <dd class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">${warehouse.address}</dd>
              </div>
              <div class="gap-4 grid grid-flow-col">
                  <button type="submit" data-modal-target="store_update_${warehouse.id}_modal" data-modal-toggle="store_update_${warehouse.id}_modal"
                    class="mt-4 flex items-center justify-center rounded-lg border border-primary-300 dark:border-primary-600 px-4 py-2.5 text-sm font-medium text-primary-700 hover:text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:hover:bg-primary-600 dark:focus:ring-primary-800 sm:mt-0">
                    <svg class="-ms-0.5 me-1.5 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
                    </svg>
                    Edit 
                  </button>
                  <button type="button" data-modal-target="delete-modal-${warehouse.id}" data-modal-toggle="delete-modal-${warehouse.id}" 
                    class="mt-4 rounded-lg border border-red-700 px-4 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 sm:mt-0">
                    Delete
                  </button>
                  <div id="delete-modal-${warehouse.id}" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                      <div class="relative w-full h-auto max-w-md max-h-full">
                          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                              <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="delete-modal-${warehouse.id}">
                                  <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                  </svg>
                                  <span class="sr-only">Close modal</span>
                              </button>
                              <div class="p-6 text-center">
                                  <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this Warehouse?</h3>
                                  <button data-modal-toggle="delete-modal-${warehouse.id}" type="button"  onclick="deleteStore('${role}', ${warehouse.id})"
                                      class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                      Yes, I'm sure
                                  </button>
                                  <button data-modal-toggle="delete-modal-${warehouse.id}" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div id="store_update_${warehouse.id}_modal" tabindex="-1" aria-hidden="true" class="max-h-auto fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden antialiased md:inset-0">
                    <div class="max-h-auto relative max-h-full w-full max-w-lg p-4">
                      <!-- Modal content -->
                      <div class="relative rounded-lg bg-white shadow dark:bg-gray-800">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Store Information</h3>
                          <button type="button" class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="store_update_${warehouse.id}_modal">
                            <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                          </button>
                        </div>
                        <!-- Modal body -->
                        <form onsubmit="updateStore(event, ${warehouse.id})" class="p-4 md:p-5">
                          <div class="mb-5 grid grid-cols-1 gap-4">

                            <div>
                              <label for="update_store_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store Name* </label>
                              <input type="text" id="update_store_name" 
                                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                                placeholder="Enter store Name" value="${warehouse.name ?? ""}" required />
                            </div>

                            <div>
                              <label for="update_store_email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store Email* </label>
                              <input type="text" id="update_store_email" 
                                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                                placeholder="Enter store Email" value="${warehouse.email ?? ""}" />
                            </div>

                            <div>
                              <label for="update_store_phone_number" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store Phone Number* </label>
                              <div class="flex items-center">
                                <div class="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                                  +234
                                </div>
                                <div class="relative w-full">
                                  <input type="text" id="update_store_phone_number" 
                                    class="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500" 
                                    pattern="[0-9]{3} [0-9]{3} [0-9]{4}" title="Number Format 123 456 7890" placeholder="123 456 7890" value="${warehouse.phone_number ?? ""}" />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label for="update_store_address" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store Address* </label>
                              <input type="text" id="update_store_address" 
                                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                                placeholder="Enter store Address" value="${warehouse.address ?? ""}" required />
                            </div>
                          
                            <div class="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
                              <button type="submit" class="me-2 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save information</button>
                              <button type="button" data-modal-toggle="store_update_${warehouse.id}_modal" class="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Cancel</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
              </div>
          </dl>`;
      }

      warehouses += "</div>"

      return warehouses

    }else {
      const response = await fetch("/api/accounts/actions/store/")

      if (!response.ok) {
        DisplayMessage("An error occured while loadin store information", "error")
        return 
      }
  
      const data = await response.json()

      let store_status = ``
      if (data.is_active) {
        store_status = `<span class="inline-block rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> Active </span>`
      } else {
        store_status = `<span class="inline-block rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300 "> Not Active </span>`
      }

      return `
        <div class="items-center rounded-lg p-4 shadow flex justify-evenly ">
          <svg class="w-[50px] h-[50px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
          </svg>
          <div class="p-5">
              <div class="flex flex-row gap-2 items-center">
                <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  ${data.name}
                </h3>
                ${store_status}
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span class="text-gray-500 dark:text-gray-400">${data.email? data.email : 'companyEmail@company.ng'}</span>
                <span class="text-gray-500 dark:text-gray-400">+234 ${data.phone_number? data.phone_number : '000 000 0000'}</span>
              </div>
              <p class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">${data.address}</p>
          </div>
        </div> `
    }
    
  }catch(error){
    DisplayMessage("An error occured while loading Store information", "error")
    return 
  }
}

const selectWarehouse = async (role, warehouse_id) => {
    try {
        let endpoint = role == "admin" ? `/api/manage/warehouses/${warehouse_id}/` : "/api/accounts/actions/store/"

        const response = await fetch(endpoint)
        if (!response.ok) {
            DisplayMessage("An error occured while trying to select store", "error")
            return null;
        }
        const data = await response.json();

        localStorage.setItem("warehouse_id", data.id);
        localStorage.setItem("warehouse_name", data.name);
        localStorage.setItem("warehouse_address", data.address);
        LoadTab('general')

    }catch(error) {
        console.log("Error", error)
        DisplayMessage("An error occured while trying to select store", "error")
        return null;
    };
}
const createStore = async (event) => {
  event.preventDefault();
  const store_name = document.getElementById("store_name").value
  const store_email = document.getElementById("store_email").value
  const store_phone_number = document.getElementById("store_phone_number").value
  const store_address = document.getElementById("store_address").value

  try {
    const response = await fetch("/api/manage/warehouses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken')
      },
      body: JSON.stringify({
        name: store_name,
        email: store_email ?? null,
        phone_number: store_phone_number ?? null,
        address: store_address
      })
    })

    if (!response.ok) {
      DisplayMessage("An error occured while trying to create store", "error")
      return
    }

    DisplayMessage("Store created successfully", "success")
    LoadTab('general')
  
  }catch(error){
    console.error(error)
    DisplayMessage("An error occured while trying to create store", "error")
    return 
  }

}
const updateStore = async (event, store_id) => {
  event.preventDefault();
  const store_name = document.getElementById("update_store_name").value
  const store_email = document.getElementById("update_store_email").value
  const store_phone_number = document.getElementById("update_store_phone_number").value
  const store_address = document.getElementById("update_store_address").value

  try {
    const response = await fetch(`/api/manage/warehouses/${store_id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken')
      },
      body: JSON.stringify({
        name: store_name,
        email: store_email ?? null,
        phone_number: store_phone_number ?? null,
        address: store_address
      })
    })

    if (!response.ok) {
      DisplayMessage("An error occured while trying to update store", "error")
      return
    }

    DisplayMessage("Store updated successfully", "success")
    LoadTab('general')
  
  }catch(error){
    console.error(error)
    DisplayMessage("An error occured while trying to update store", "error")
    return 
  }
}
const deleteStore = async (role, store_id) => {

    if(role != "admin" || !store_id) {
      DisplayMessage("You don't have permission to delete store", "error")
      return
    }

    try {
        const response = await fetch(`/api/manage/warehouses/${store_id}/`)
        if (!response.ok){
            DisplayMessage("Couldn't identify store", "error")
            return
        }
        const data = await response.json()
        
        await fetch(`/api/manage/warehouses/${store_id}/`, {
            method: "DELETE",
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        DisplayMessage("Store deleted successfully", "success")

        localStorage.removeItem("warehouse_id");
        localStorage.removeItem("warehouse_name");
        localStorage.removeItem("warehouse_address");

        LoadTab('general')

    }catch(error) {
        DisplayMessage("Couldn't identify store", "error")
        return;
    }
}


const customer_info = async (role) => {

  try {

    const response = await fetch("/api/accounts/actions/info/")
    if (!response.ok) {
      DisplayMessage("An error occured while loading customer information", "error")
      return 
    }

    const data = await response.json()

      let store_detail = "";
      if (data.store_detail) {
          let email = data.store_detail.email? `<dd class="text-gray-500 dark:text-gray-400">${data.store_detail.email}</dd>` : '';
          store_detail = `
            <dd class="text-gray-500 dark:text-gray-400">${data.store_detail.name}, Number: +234 ${data.phone_number? data.phone_number : "000 000 0000"}</dd>
            ${email}
            <dd class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <svg class="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"
                />
              </svg>
              ${data.store_detail.address}
            </dd>`
      } else {
          store_detail = `<dd class="text-gray-500 dark:text-gray-400">No store assigned</dd>`
      }

      user_role = ""
      if (data.role == "admin") {
        user_role = `<span class="mb-2 inline-block rounded bg-admin-100 px-2.5 py-0.5 text-xs font-medium text-admin-800 dark:bg-admin-900 dark:text-admin-300"> ${data.role} </span>`
      } else if (data.role == "staff") {
        user_role = `<span class="mb-2 inline-block rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> ${data.role} </span>`
      } else {
        user_role = `<span class="mb-2 inline-block rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300"> ${data.role} </span>`
      }

      let username_value = data.username ? `value="${data.username}"` : '';
      let phone_value = data.phone_number ? `value="${data.phone_number}"` : '';

    html = `<div class="py-4 md:py-8">
      <div class="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
        <div class="space-y-4">
          <div class="flex space-x-4">
            <img class="h-16 w-16 rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png" alt="Helene avatar" />
            <div>
              <div class="flex justify-between space-x-2">
                ${user_role}
                <span class="text-lg font-medium leading-none text-gray-900 dark:text-white hover:underline"> ${data.user_uuid.substring(0, 8)} </span>
              </div>
              <h2 class="flex items-center text-xl font-bold leading-none text-gray-900 dark:text-white sm:text-2xl">${data.username}</h2>
            </div>
          </div>
          <dl>
            <dt class="font-semibold text-gray-900 dark:text-white">Email Address</dt>
            <dd class="text-gray-500 dark:text-gray-400">${data.email}</dd>
          </dl>
          <dl>
            <dt class="font-semibold text-gray-900 dark:text-white">Phone Number</dt>
            <dd class="text-gray-500 flex items-center gap-1 dark:text-gray-400">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"/>
              </svg> +234 ${data.phone_number? data.phone_number : "000 000 0000"}
            </dd>
          </dl>
        </div>
        <div class="space-y-4">
          <dl>
            <dt class="font-semibold text-gray-900 dark:text-white">Store</dt>
              ${store_detail}
          </dl>
          <dl>
            <button type="button" data-modal-target="account_edit_modal" data-modal-toggle="account_edit_modal" class="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto">
              <svg class="-ms-0.5 me-1.5 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
              </svg>
              Edit Information
            </button>
          </dl>
        </div>
      </div>
    </div>
    
      <!-- Account Information Modal -->
    <div id="account_edit_modal" tabindex="-1" aria-hidden="true" class="max-h-auto fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden antialiased md:inset-0">
      <div class="max-h-auto relative max-h-full w-full max-w-lg p-4">
        <!-- Modal content -->
        <div class="relative rounded-lg bg-white shadow dark:bg-gray-800">
          <!-- Modal header -->
          <div class="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
            <button type="button" class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="account_edit_modal">
              <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <form onsubmit="updateInfo(event, ${data.id})" class="p-4 md:p-5">
            <div class="mb-5 grid grid-cols-1 gap-4">

              <div>
                <label for="username_info_modal" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your UserName* </label>
                <input type="text" id="username_info_modal" 
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                  placeholder="Enter your Username" ${username_value} required />
              </div>

              <div>
                <label for="phone_input" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone Number* </label>
                <div class="flex items-center">
                  <div class="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                    +234
                  </div>
                  <div class="relative w-full">
                    <input type="text" id="phone_input" 
                      class="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500" 
                      pattern="[0-9]{3} [0-9]{3} [0-9]{4}" title="Number Format 123 456 7890" placeholder="123 456 7890" ${phone_value} />
                  </div>
                </div>
              </div>
            
              <div class="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
                <button type="submit" class="me-2 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save information</button>
                <button type="button" data-modal-toggle="account_edit_modal" class="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`

    return html

  }catch(error){
    console.error(error)
    DisplayMessage("An error occured while trying to load customer information", "error")
    return 
  }
  
}

const updateInfo = async (event, user_id) => {
  event.preventDefault()
  const username = document.getElementById("username_info_modal").value
  const phone_number = document.getElementById("phone_input").value

  try {
    const response = await fetch(`/api/accounts/actions/${user_id}/info_update/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken')
      },
      body: JSON.stringify({
        username: full_name,
        phone_number: phone_number
      })
    })

      if (!response.ok) {
        DisplayMessage("An error occured while trying to update information", "error")
        return
      }

      DisplayMessage("Information updated successfully", "success")
      LoadTab('general')

  }catch(error){
    console.error(error)
    DisplayMessage("An error occured while trying to update information", "error")
    return 
  }
}



const category_info = async (role) => {

  try {

    let create_category = ""
    if (role == "admin") {
      create_category = `
            <dl class="sm:col-span-2 md:col-span-3">
                <button id="category_create_button" data-dropdown-toggle="category_create" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 flex justify-between w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="button">
                    Create category
                    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>

                <!-- Dropdown menu -->
                <div id="category_create" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                    <div class="flex flex-row justify-between space-y-2">
                        <form onsubmit="createCategory(event)"
                            class="flex md:justify-between md:items-center md:flex-row flex-col justify-center items-center space-x-0 space-y-1 md:space-y-0 md:space-x-4">
                            <input type="text" id="create_category_input"
                                class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                placeholder="Category Name" required>
                            <button type="submit" id="createCategoryButton"
                            class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </dl>`
    }
    let categories = `
        <div>
          <div class="h-fit max-h-[30vh] overflow-y-auto grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            ${create_category}`

    const response = await fetch("/api/shelf/categories/")
    if (!response.ok) {
        DisplayMessage("No category found", "error")
        return;
    }

    const data = await response.json();
    if (!data || !data.results) {
        DisplayMessage("No category found", "error")
        return;
    }

    let results = data.results
    for (category of results) {
      categories += `
        <dl class="flex items-center justify-evenly rounded-lg border border-gray-200 bg-white px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <dt class="text-sm font-medium text-gray-900 dark:text-white">${category.name}</dt>
          <div class="flex flex-row justify-between w-[30%]">
              <dd>
                  <button type="submit" data-modal-target="category_update_${category.id}_modal" data-modal-toggle="category_update_${category.id}_modal"
                        class="rounded-md border border-primary-700 px-1.5 py-1.5 text-center text-sm font-medium text-primary-700 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-primary-300 dark:border-primary-500 dark:text-primary-500 dark:hover:bg-primary-600 dark:hover:text-white dark:focus:ring-primary-900">
                        <svg class="w-4 h-4 text-primary-700 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                        </svg>
                  </button>
                  <div id="category_update_${category.id}_modal" tabindex="-1" aria-hidden="true" class="max-h-auto fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden antialiased md:inset-0">
                    <div class="max-h-auto relative max-h-full w-full max-w-lg p-4">
                      <!-- Modal content -->
                      <div class="relative rounded-lg bg-white shadow dark:bg-gray-800">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Category Information</h3>
                          <button type="button" class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="category_update_${category.id}_modal">
                            <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                          </button>
                        </div>
                        <!-- Modal body -->
                        <form onsubmit="updateCategory(event, ${category.id})" class="p-4 md:p-5">
                          <div class="mb-5 grid grid-cols-1 gap-4">

                            <div>
                              <label for="update_category_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Category Name* </label>
                              <input type="text" id="update_category_name" 
                                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                                placeholder="Enter Category Name" value="${category.name ?? ""}" required />
                            </div>
                          
                            <div class="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
                              <button type="submit" class="me-2 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save information</button>
                              <button type="button" data-modal-toggle="category_update_${category.id}_modal" class="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Cancel</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
              </dd>
              <dd>
                  <button type="button" data-modal-target="category-delete-modal-${category.id}" data-modal-toggle="category-delete-modal-${category.id}" 
                    class="rounded-md border border-red-700 px-1.5 py-1.5 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900">
                    <svg class="w-4 h-4 text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                    </svg>
                  </button>
                  <div id="category-delete-modal-${category.id}" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                      <div class="relative w-full h-auto max-w-md max-h-full">
                          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                              <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="category-delete-modal-${category.id}">
                                  <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                  </svg>
                                  <span class="sr-only">Close modal</span>
                              </button>
                              <div class="p-6 text-center">
                                  <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this category?</h3>
                                  <button data-modal-toggle="category-delete-modal-${category.id}" type="button"  onclick="deleteCategory('${role}', ${category.id})"
                                      class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                      Yes, I'm sure
                                  </button>
                                  <button data-modal-toggle="category-delete-modal-${category.id}" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </dd>
          </div>
        </dl>`
    }
    categories += "</div>"

    return categories
    
  }catch(error){
    DisplayMessage("An error occured while loading category information", "error")
    return 
  }
}

const createCategory = async (event) => {
  event.preventDefault();
  let category_name = document.getElementById("create_category_input").value;

  if (!category_name) {
      DisplayMessage("Category name required", "error");
      return
  }

  try {
      const response = await fetch("/api/shelf/categories/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify({name: category_name}),
      });

      if (!response.ok) {
          DisplayMessage("Couldn't create Category", "error");
          return null;
      }

      const data = await response.json();

      if (!data) {
          DisplayMessage("Couldn't create Category", "error");
          return null;
      }

      LoadTab('general')

  } catch (error) {
    DisplayMessage("Couldn't create Category", "error");
    return null;
  }
}
const updateCategory = async (event, category_id) => {
  event.preventDefault();
  let category_name = document.getElementById("update_category_name").value;
  try {
    const response = await fetch(`/api/shelf/categories/${category_id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken')
      },
      body: JSON.stringify({
        name: category_name
      })
    })

    if (!response.ok) {
      DisplayMessage("An error occured while trying to update category", "error")
      return
    }

    DisplayMessage("Category updated successfully", "success")
    LoadTab('general')

  }catch(error){
    DisplayMessage("An error occured while trying to update category", "error")
    return 
  }
}
const deleteCategory = async (role, category_id) => {
  if (role != "admin") {
    DisplayMessage("You are not authorized to delete category", "error")
    return
  }
  try {
    const response = await fetch(`/api/shelf/categories/${category_id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken')
      }
    })

    if (!response.ok) {
      DisplayMessage("An error occured while trying to delete category", "error")
      return
    }

    DisplayMessage("Category deleted successfully", "success")
    LoadTab('general')

  }catch(error){
    console.error(error)
    DisplayMessage("An error occured while trying to delete category", "error")
    return 
  }
}



const vendor_info = async () => {}
const transfer_info = async () => {}
const location_info = async () => {}
 


const load_accordion = async (container_id, container_func, role, page, warehouse_id) => {
    const accordion_container = document.getElementById(container_id);

    if (!accordion_container.classList.contains("hidden")) {
        accordion_container.innerHTML = "";
        return
    }

    const accordion_content = await container_func(role, page, warehouse_id);

    accordion_container.innerHTML = accordion_content;

    initializeFlowbite();
    return

}

async function GeneralPage(role, warehouse_id) {
    //<p>this will contain all infor like for locations, warehouse, vendors(providers), transfers customers and categories it'll use the default blank templats and make sure that admin features are enforced like modifying shit</p>
    
    return `
      <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl md:mb-6">General overview</h2>
      <div id="general" data-accordion="collapse" data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-inactive-classes="text-gray-500 dark:text-gray-400">
        <h2 id="general-customer-heading">
          <button type="button" onclick="load_accordion('general-customer-body', customer_info, '${role}', '', '${warehouse_id}')"
            class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#general-customer-body" 
            aria-expanded="false" aria-controls="general-customer-body">
            <span>Personal Information</span>
            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
            </svg>
          </button>
        </h2>
        <div id="general-customer-body" class="hidden" aria-labelledby="general-customer-heading">
          
        </div>

        <h2 id="general-warehouse-heading">
          <button type="button" onclick="load_accordion('general-warehouse-body', warehouse_info, '${role}', '', '${warehouse_id}')"
            class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#general-warehouse-body" 
            aria-expanded="false" aria-controls="general-warehouse-body">
            <span>Store Information</span>
            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
            </svg>
          </button>
        </h2>
        <div id="general-warehouse-body" class="hidden" aria-labelledby="general-warehouse-heading">
          
        </div>

        <h2 id="general-category-heading">
          <button type="button" onclick="load_accordion('general-category-body', category_info, '${role}', '', '${warehouse_id}')"
            class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3" 
            data-accordion-target="#general-category-body" aria-expanded="false" aria-controls="general-category-body">
            <span>Product Categories </span>
            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
            </svg>
          </button>
        </h2>
        <div id="general-category-body" class="hidden" aria-labelledby="general-category-heading">
          
        </div>
      </div>
      `;
}

window.GeneralPage = GeneralPage;