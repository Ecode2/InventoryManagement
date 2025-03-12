const users = async (role, page) => {
  if(role != "admin"){
    DisplayMessage("You are not authorized to view this page", "error")
    LoadTab("general")
    return null
  }

  if (!page) {
    page = "/api/accounts/users/"
  }

  try {

    const response = await fetch(page)
    if (!response.ok) {
      DisplayMessage("Couldn't get Users Info", "error")
      return null;
    }

    const data = await response.json();
    if (!data || !data.results) {
      DisplayMessage("Couldn't get Users Info", "error")
      return null;
    }

    const count = data.count;
    const next = data.next;
    const previous = data.previous;
    const results = data.results;

    html = ""

    for (let user of results) {
        let user_role = ""
        let role_option = ""
        if (user.role == "admin") {
          user_role = `
              <div class="flex flex-row items-center justify-around rounded bg-admin-100 px-2.5 py-0.5 text-xs font-medium text-admin-800 dark:bg-admin-900 dark:text-admin-300">
                  <svg class="w-3 h-3 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"></path>
                  </svg>
                  ${user.role}
              </div>
              `
          role_option = `
                <option value="admin" selected="">Admin</option>
                <option value="staff">Staff</option>
                <option value="customer">Customer</option>`

        } else if (user.role == "staff") {
          user_role = `
              <div class="flex flex-row items-center justify-around rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"/>
                  </svg>
                  ${user.role}
              </div>
              `
          role_option = `
              <option value="admin">Admin</option>
              <option value="staff" selected="">Staff</option>
              <option value="customer">Customer</option>`
        } else {
          user_role = `
              <div class="flex flex-row items-center justify-around rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                  <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                    <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                  ${user.role}
              </div>
              `
          role_option = `
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer" selected="">Customer</option>`
        }

        let user_active =""
        if (user.is_active) { 
            user_active = `
              <div class="flex flex-row items-center justify-around rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.5 11.5 11 13l4-3.5M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z"/>
                  </svg>
                  Active
              </div>`
        }else {
          user_active = `
          <div class="flex flex-row items-center justify-around rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
              <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              Deactivated
          </div>`
        }

        let role_input = `
              <select id="user_${user.id}_role" 
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                  ${role_option}
              </select>`

        let store_detail = "";
        if (user.store_detail) {
            let email = user.store_detail.email? `<dd class="text-gray-500 dark:text-gray-400">${user.store_detail.email}</dd>` : '';
            store_detail = `
              <dd class="text-gray-500 dark:text-gray-400">${user.store_detail.name}, Number: +234 ${user.phone_number? user.phone_number : "000 000 0000"}</dd>
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
                ${user.store_detail.address}
              </dd>`
        } else {
            store_detail = `<dd class="text-gray-500 dark:text-gray-400">No store assigned</dd>`
        }

        let username_value = user.username ? `value="${user.username}"` : '';
        let phone_value = user.phone_number ? `value="${user.phone_number}"` : '';

        let daily_sale = user.sales_data.daily_sales ? `${user.sales_data.daily_sales}` : 0
        let daily_revenue = user.sales_data.daily_revenue ? `${user.sales_data.daily_revenue}` : 0.00
        console.log(daily_revenue, daily_sale, user, "ecevrfdc")

        html += `
          <tr id="accordion-flush-${user.id}-heading" class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              data-accordion-target="#accordion-flush-${user.id}-body" aria-expanded="false" aria-controls="accordion-flush-${user.id}-body">
              <td class="p-4 w-4">
                  <div class="flex items-center">
                      <input id="checkbox-table-1" type="checkbox" onclick="event.stopPropagation()" 
                          class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <label for="checkbox-table-1" class="sr-only">checkbox</label>
                  </div>
              </td>
              <td class="p-4 w-4">
                  <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                  </svg>
              </td>
              <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div class="flex items-center mr-3">
                      <div class="text-base font-semibold">${user.username}</div>
                  </div>
              </th>
              <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  ${user.email}
              </td>
              <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  ${user_role}
              </td>
              <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">${user_active}</td>
              <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">${daily_sale}</td>
              <td class="px-4 py-3 font-medium ">                    
                  #${daily_revenue}
              </td>
          </tr>
          <tr id="accordion-flush-${user.id}-body" class="hidden" aria-labelledby="accordion-flush-${user.id}-heading">
              <td colspan="8">
                  <div class="py-4 md:py-8">
                    <div class="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
                      <div class="space-y-4">
                        <div class="flex space-x-4">
                          <img class="h-16 w-16 rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png" alt="Helene avatar" />
                          <div>
                            <div class="flex justify-between space-x-2">
                              ${user_role}
                              <span class="text-lg font-medium leading-none text-gray-900 dark:text-white hover:underline"> ${user.user_uuid.substring(0, 8)} </span>
                            </div>
                            <h2 class="flex items-center text-xl font-bold leading-none text-gray-900 dark:text-white sm:text-2xl">${user.username}</h2>
                          </div>
                        </div>
                        <div class="flex w-full flex-col gap-2 md:flex-row">
                            <dl>
                              <dt class="font-semibold text-gray-900 dark:text-white">Email Address</dt>
                              <dd class="text-gray-500 dark:text-gray-400">${user.email}</dd>
                            </dl>

                            <dl>
                              <dt class="font-semibold text-gray-900 dark:text-white">Phone Number</dt>
                              <dd class="text-gray-500 flex items-center gap-1 dark:text-gray-400">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"/>
                                </svg> +234 ${user.phone_number? user.phone_number : "000 000 0000"}
                              </dd>
                            </dl>
                        </div>
                      </div>
                      <div class="space-y-4">
                        <dl>
                          <dt class="font-semibold text-gray-900 dark:text-white">Store</dt>
                            ${store_detail}
                        </dl>
                        <dl class="flex flex-row items-center gap-4">
                          <button type="button" data-modal-target="user_edit_${user.id}_modal" data-modal-toggle="user_edit_${user.id}_modal" class="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto">
                            <svg class="-ms-0.5 me-1.5 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
                            </svg>
                            Edit
                          </button>
                          <button type="button" data-modal-target="user_activity_${user.id}_modal" data-modal-toggle="user_activity_${user.id}_modal" class="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto">
                            Activity
                          </button>
                        </dl>
                      </div>
                    </div>
                  </div>
                  
                    <!-- Account Information Modal -->
                  <div id="user_edit_${user.id}_modal" tabindex="-1" aria-hidden="true" class="max-h-auto fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden antialiased md:inset-0">
                    <div class="max-h-auto relative max-h-full w-full max-w-lg p-4">
                      <!-- Modal content -->
                      <div class="relative rounded-lg bg-white shadow dark:bg-gray-800">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
                          <button type="button" class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="user_edit_${user.id}_modal">
                            <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                          </button>
                        </div>
                        <!-- Modal body -->
                        <form onsubmit="updateUserInfo(event, '${role}', ${user.id})" class="p-4 md:p-5">
                          <div class="mb-5 grid grid-cols-1 gap-4">

                            <div>
                              <label for="user_${user.id}_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> UserName* </label>
                              <input type="text" id="user_${user.id}_name" 
                                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                                placeholder="Enter your Username" ${username_value} required />
                            </div>

                            <div>
                              <label for="user_${user.id}_phone" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone Number* </label>
                              <div class="flex items-center">
                                <div class="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                                  +234
                                </div>
                                <div class="relative w-full">
                                  <input type="text" id="user_${user.id}_phone" 
                                    class="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500" 
                                    pattern="[0-9]{3} [0-9]{3} [0-9]{4}" title="Number Format 123 456 7890" placeholder="123 456 7890" ${phone_value} />
                                </div>
                              </div>
                            </div>

                            <div>
                            ${await get_user_store(user.store, user.id)}
                            <div>
                              <label for="user_${user.id}_role" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Role* </label>
                              ${role_input}
                            </div>

                            <div class="flex flex-row items-center gap-4 m-4">
                              <input id="user_${user.id}_status" type="checkbox" ${user.is_active ? 'checked' : ''} class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                              <label for="user_${user.id}_status" class="block text-sm font-medium text-gray-900 dark:text-white"> Active Status </label> 
                            </div>
                          
                            <div class="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
                              <button type="submit" class="me-2 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save information</button>
                              <button type="button" data-modal-toggle="user_edit_${user.id}_modal" class="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Cancel</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
              </td>
          </tr>`;
    }

    paginator = ``;
    let prev = "";
    let prev_url = previous;
    let nxt = "";
    let nxt_url = next;

    if (previous) {
        let prevRegex = /[?&]page=(\d+)/;
        let match = url.match(prevRegex);
        if (match) {
            prev = match[1];
        }else {
            prev = "1"
        }
    } else {
        prev_url = null;
    }

    if (next) {
        let nxtRegex = /[?&]page=(\d+)/;
        let match = url.match(nxtRegex);
        if (match) {
            nxt = match[1];
        }
    } else {
        nxt_url = null;
    }

    paginator += `<nav class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 p-4" aria-label="Table navigation">
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                <span class="font-semibold text-gray-900 dark:text-white">${count}</span>
                Results
            </span>
            <ul class="inline-flex items-stretch -space-x-px">
                <li>
                    <div onclick="load_users('${role || null}', '${prev_url}')" 
                    class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span class="sr-only">Previous</span>
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </li>
                <li>
                    <div onclick="load_users('${role || null}', '${prev_url}')" 
                    class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${prev}</div>
                </li>
                <li>
                    <div onclick="load_users('${role || null}', '${nxt_url}')" 
                    class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${nxt}</div>
                </li>
                <li>
                    <div onclick="load_users('${role || null}', '${nxt_url}')" 
                    class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span class="sr-only">Next</span>
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </li>
            </ul>
        </nav>`;

    return { html, count, next, previous, results, paginator };


  }catch(error) {
    console.error('Error:', error);
    DisplayMessage("Couldn't get Users Info", "error");
    return null;
  }
  
}

const get_user_store = async (store_id, user_id) => {
  try {
      const response = await fetch("/api/manage/warehouses/")
      if (!response.ok) {
          return `
              <label for="user_${user_id}_store" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store* </label>
              <select id="user_${user_id}_store" 
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"> 
                <option value="" selected="">
                    <span>--- Assign Store</span>
                </option>`;
      }

      const data = await response.json();
      if (!data || !data.results) {
          return `
              <label for="user_${user_id}_store" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store* </label>
              <select id="user_${user_id}_store" 
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"> 
                <option value="" selected="">
                    <span>--- Assign Store</span>
                </option>`;
      }
      
      let warehouses = data.results

      if (warehouses.length == 0) {
          return `
              <label for="user_${user_id}_store" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store* </label>
              <select id="user_${user_id}_store" 
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"> 
                <option value="" selected="">
                    <span>----No Store Assigned----</span>
                </option>`;
      }

      let selected = false

      let warehouse_select = `
              <label for="user_${user_id}_store" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store* </label>
              <select id="user_${user_id}_store" 
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"> `;

      for (let warehouse of warehouses) {
          if (warehouse.id == store_id) {
            warehouse_select += `
                  <option value="${warehouse.id}" selected="">
                      <span>${warehouse.name}</span>
                      <span>${warehouse.address}</span>
                  </option>`;
            selected = true;
            continue
          }
          warehouse_select += `
                  <option value="${warehouse.id}">
                      <span>${warehouse.name}</span>
                      <span>${warehouse.address}</span>
                  </option>`;
      }
      if (!selected) {
        warehouse_select += `
          <option value="" selected="">
              <span>--- Assign Store</span>
          </option>`
      }

      warehouse_select += `
              </select>`;

      return warehouse_select

  } catch (error) {
      DisplayMessage("Couldnt get a warehouse", "error");
      return `
              <label for="user_${user_id}_store" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Store* </label>
              <select id="user_${user_id}_store" 
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"> 
                <option value="" selected="">
                    <span>--- Assign Store</span>
                </option>`;

  }
}

const updateUserInfo = async (event, role, user_id) => {
  event.preventDefault()
  const username = document.getElementById(`user_${user_id}_name`).value
  const phone_number = document.getElementById(`user_${user_id}_phone`).value
  const store = document.getElementById(`user_${user_id}_store`).value
  const user_role = document.getElementById(`user_${user_id}_role`).value
  const status = document.getElementById(`user_${user_id}_status`).checked

  try {
    const response = await fetch(`/api/accounts/users/${user_id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken')
      },
      body: JSON.stringify({
        username: username,
        phone_number: phone_number,
        store: store,
        role: user_role,
        is_active: status
      })
    })

      if (!response.ok) {
        DisplayMessage("An error occured while trying to update information", "error")
        return
      }

      DisplayMessage("Information updated successfully", "success")
      //LoadTab('users')
      window.location.reload()
      return
      //return load_users(role)

  }catch(error){
    console.error(error)
    DisplayMessage("An error occured while trying to update information", "error")
    return 
  }
}


const load_users = async (role, page) => {
  let categories = "";
  let order = "";

  if (!role || role == "null") {
    role = null
  }
  let sorting = ""
  let response

  try {
    if (page && page != "") {
      response = await users(role, page+sorting);
    }else {
      let new_page = "/api/accounts/users/"
      response = await users(role, new_page+sorting);
    }
    
    if (!response) {
      DisplayMessage("An error occurred", "error");
      return
    }

    let html = "";
    let count = "";
    let paginator = "";
    
    if (response && response.html) {
      html = response.html;
      count = response.count;
      paginator = response.paginator;
    }
    const user_section = document.getElementById("users_section");

    const total = document.getElementById("total-users");
    const total_tooltip = document.getElementById("users-tooltip");

    const pagination_section = document.getElementById("users_pagination");

    user_section.innerHTML = "";
    user_section.innerHTML = html;

    total.innerText = count;
    total_tooltip.innerHTML = `Showing 10 of ${count} Users
                              <div class="tooltip-arrow" data-popper-arrow=""></div>
                              `;

    pagination_section.innerHTML = "";
    pagination_section.innerHTML = paginator

    initializeFlowbite();

  }catch {
    console.log("error")
    return
  }
};

let debounceUserTimeout;
const debounceGetUser = (search_input, role) => {
  clearTimeout(debounceUserTimeout);
  debounceUserTimeout = setTimeout(
    () => getUser(search_input, role),
    1000
  );
};
const getUser = async (search_input, role) => {
  const input_value = search_input.value;

  if (input_value.length >= 3) {
    // search for the item
    load_users(role, `/api/accounts/users/?search=${input_value}`);
  } else {
    // load the normal page if input length is less than 3
    load_users(role);
  }
};


async function UserPage(role) {

    const response = await users(role);
    let html = "";
    let results = "";
    let count = ""
    let paginator = "";

    if (response && response.html) {
        html = response.html;
        results = response.results;
        paginator = response.paginator;
        count = response.count;
    }

    return `<section class="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
    <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
      <!-- Heading & Filters -->
      <div class="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
        <div>
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li class="inline-flex items-center">
                <div onclick="LoadTab('general')"
                class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
                  <svg class="me-2.5 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </div>
              </li>
              <li>
                <div onclick="LoadTab('user')" class="flex items-center">
                  <svg class="h-5 w-5 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
                  </svg>
                  <a href="#" class="ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white md:ms-2">Users</a>
                </div>
              </li>
            </ol>
          </nav>
          <div class="flex space-x-2 justify-between items-center flex-nowrap">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Users</h2>
              <form class="flex items-center">
                  <label for="simple-search" class="sr-only">Search</label>
                  <div class="relative w-full">
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                          </svg>
                      </div>
                      <input type="text" id="simple-search" placeholder="Search for user" required="" oninput="debounceGetUser(this, '${role}')"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  </div>
              </form>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button data-modal-toggle="user-filterModal" data-modal-target="user-filterModal" type="button" class="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
            <svg class="-ms-0.5 me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
            </svg>
            Filters
            <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
            </svg>
          </button>
          <button id="user-sortDropdownButton1" data-dropdown-toggle="user-dropdownSort1" type="button" class="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
            <svg class="-ms-0.5 me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4" />
            </svg>
            Sort
            <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
            </svg>
          </button>
          <div id="user-dropdownSort1" class="z-50 hidden w-40 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700" data-popper-placement="bottom">
            <ul class="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400" aria-labelledby="user-sortDropdownButton">
              <li>
                <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> The most popular </a>
              </li>
              <li>
                <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Newest </a>
              </li>
              <li>
                <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Increasing price </a>
              </li>
              <li>
                <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Decreasing price </a>
              </li>
              <li>
                <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> No. reviews </a>
              </li>
              <li>
                <a href="#" class="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Discount % </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

        <div class="bg-gray-50 dark:bg-gray-900 antialiased">
            <div class="mx-auto max-w-screen-2xl">
                <div class="bg-white dark:bg-gray-800 relative h-screen shadow-md sm:rounded-lg overflow-hidden">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4 p-4">
                        <div class="flex-1 flex items-center space-x-2">
                            <h5>
                                <span class="text-gray-500">All Users: </span>
                                <span id="total-users" class="dark:text-white">${count}</span>
                            </h5>
                            <button type="button" class="group" data-tooltip-target="users-tooltip">
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" viewbox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                </svg>
                                <span class="sr-only">More info</span>
                            </button>
                            <div id="users-tooltip" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                Showing 10 of ${count} users
                                <div class="tooltip-arrow" data-popper-arrow=""></div>
                            </div>
                        </div>
                        <div class="flex-shrink-0 flex flex-col items-start sm:flex-row sm:items-center lg:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                            <button type="button" class="flex-shrink-0 inline-flex items-center justify-center py-2 px-3 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="currentColor" class="mr-2 w-4 h-4" aria-hidden="true">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
                                </svg>
                                Table settings
                            </button>
                        </div>
                    </div>
                    
                    <div id="user_section" class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="p-4">
                                        <div class="flex items-center">
                                            <input id="users-checkbox-all" type="checkbox" class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                            <label for="users-checkbox-all" class="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                    <th scope="col" class="p-4">
                                        <span class="sr-only"> Expand / Collaps Row </span>
                                    </th>
                                    <th scope="col" class="p-4">Username</th>
                                    <th scope="col" class="p-4">Email</th>
                                    <th scope="col" class="p-4">Role</th>
                                    <th scope="col" class="p-4">Status</th>
                                    <th scope="col" class="p-4">Daily Sales</th>
                                    <th scope="col" class="p-4"> Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody id="users_section" data-accordion="collapse">
                                ${html}
                            </tbody>
                        </table>
                    </div>

                    <div id="users_pagination">
                      ${paginator}
                    </div>

                </div>
            </div>
        </div>

      
    </div>
    <!-- Filter modal -->
    <form action="#" method="get" id="user-filterModal" tabindex="-1" aria-hidden="true" class="fixed left-0 right-0 top-0 z-50 hidden h-modal w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full">
      <div class="relative h-full w-full max-w-xl md:h-auto">
        <!-- Modal content -->
        <div class="relative rounded-lg bg-white shadow dark:bg-gray-800">
          <!-- Modal header -->
          <div class="flex items-start justify-between rounded-t p-4 md:p-5">
            <h3 class="text-lg font-normal text-gray-500 dark:text-gray-400">Filters</h3>
            <button type="button" class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="user-filterModal">
              <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="px-4 md:px-5">
            <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul class="-mb-px flex flex-wrap text-center text-sm font-medium" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                <li class="mr-1" role="presentation">
                  <button class="inline-block pb-2 pr-1" id="brand-tab" data-tabs-target="#brand" type="button" role="tab" aria-controls="profile" aria-selected="false">Brand</button>
                </li>
                <li class="mr-1" role="presentation">
                  <button class="inline-block px-2 pb-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300" id="advanced-filers-tab" data-tabs-target="#advanced-filters" type="button" role="tab" aria-controls="advanced-filters" aria-selected="false">Advanced Filters</button>
                </li>
              </ul>
            </div>
            <div id="myTabContent">
              <div class="grid grid-cols-2 gap-4 md:grid-cols-3" id="brand" role="tabpanel" aria-labelledby="brand-tab">
                <div class="space-y-2">
                  <h5 class="text-lg font-medium uppercase text-black dark:text-white">A</h5>

                  <div class="flex items-center">
                    <input id="apple" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="apple" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Apple (56) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="asus" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="asus" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Asus (97) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="acer" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="acer" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Acer (234) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="allview" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="allview" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Allview (45) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="atari" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="asus" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Atari (176) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="amd" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="amd" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> AMD (49) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="aruba" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="aruba" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Aruba (16) </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <h5 class="text-lg font-medium uppercase text-black dark:text-white">B</h5>

                  <div class="flex items-center">
                    <input id="beats" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="beats" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Beats (56) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="bose" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="bose" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Bose (97) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="benq" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="benq" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> BenQ (45) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="bosch" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="bosch" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Bosch (176) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="brother" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="brother" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Brother (176) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="biostar" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="biostar" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Biostar (49) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="braun" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="braun" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Braun (16) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="blaupunkt" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="blaupunkt" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Blaupunkt (45) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="benq2" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="benq2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> BenQ (23) </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <h5 class="text-lg font-medium uppercase text-black dark:text-white">C</h5>

                  <div class="flex items-center">
                    <input id="canon" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="canon" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Canon (49) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="cisco" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="cisco" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Cisco (97) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="cowon" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="cowon" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Cowon (234) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="clevo" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="clevo" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Clevo (45) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="corsair" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="corsair" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Corsair (15) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="csl" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="csl" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Canon (49) </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <h5 class="text-lg font-medium uppercase text-black dark:text-white">D</h5>

                  <div class="flex items-center">
                    <input id="dell" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="dell" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Dell (56) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="dogfish" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="dogfish" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Dogfish (24) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="dyson" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="dyson" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Dyson (234) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="dobe" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="dobe" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Dobe (5) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="digitus" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="digitus" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Digitus (1) </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <h5 class="text-lg font-medium uppercase text-black dark:text-white">E</h5>

                  <div class="flex items-center">
                    <input id="emetec" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="emetec" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Emetec (56) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="extreme" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="extreme" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Extreme (10) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="elgato" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="elgato" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Elgato (234) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="emerson" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="emerson" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Emerson (45) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="emi" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="emi" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> EMI (176) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="fugoo" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="fugoo" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Fugoo (49) </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <h5 class="text-lg font-medium uppercase text-black dark:text-white">F</h5>

                  <div class="flex items-center">
                    <input id="fujitsu" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="fujitsu" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Fujitsu (97) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="fitbit" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Fitbit (56) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="foxconn" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="foxconn" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Foxconn (234) </label>
                  </div>

                  <div class="flex items-center">
                    <input id="floston" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                    <label for="floston" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Floston (45) </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4" id="advanced-filters" role="tabpanel" aria-labelledby="advanced-filters-tab">
              <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="min-price" class="block text-sm font-medium text-gray-900 dark:text-white"> Min Price </label>
                    <input id="min-price" type="range" min="0" max="7000" value="300" step="1" class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700" />
                  </div>

                  <div>
                    <label for="max-price" class="block text-sm font-medium text-gray-900 dark:text-white"> Max Price </label>
                    <input id="max-price" type="range" min="0" max="7000" value="3500" step="1" class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700" />
                  </div>

                  <div class="col-span-2 flex items-center justify-between space-x-2">
                    <input type="number" id="min-price-input" value="300" min="0" max="7000" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 " placeholder="" required />

                    <div class="shrink-0 text-sm font-medium dark:text-gray-300">to</div>

                    <input type="number" id="max-price-input" value="3500" min="0" max="7000" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="" required />
                  </div>
                </div>

                <div class="space-y-3">
                  <div>
                    <label for="min-delivery-time" class="block text-sm font-medium text-gray-900 dark:text-white"> Min Delivery Time (Days) </label>

                    <input id="min-delivery-time" type="range" min="3" max="50" value="30" step="1" class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700" />
                  </div>

                  <input type="number" id="min-delivery-time-input" value="30" min="3" max="50" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 " placeholder="" required />
                </div>
              </div>

              <div>
                <h6 class="mb-2 text-sm font-medium text-black dark:text-white">Condition</h6>

                <ul class="flex w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <li class="w-full border-r border-gray-200 dark:border-gray-600">
                    <div class="flex items-center pl-3">
                      <input id="condition-all" type="radio" value="" name="list-radio" checked class="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600" />
                      <label for="condition-all" class="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"> All </label>
                    </div>
                  </li>
                  <li class="w-full border-r border-gray-200 dark:border-gray-600">
                    <div class="flex items-center pl-3">
                      <input id="condition-new" type="radio" value="" name="list-radio" class="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600" />
                      <label for="condition-new" class="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"> New </label>
                    </div>
                  </li>
                  <li class="w-full">
                    <div class="flex items-center pl-3">
                      <input id="condition-used" type="radio" value="" name="list-radio" class="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600" />
                      <label for="condition-used" class="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"> Used </label>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div>
                  <h6 class="mb-2 text-sm font-medium text-black dark:text-white">Colour</h6>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <input id="blue" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="blue" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                        <div class="mr-2 h-3.5 w-3.5 rounded-full bg-primary-600"></div>
                        Blue
                      </label>
                    </div>

                    <div class="flex items-center">
                      <input id="gray" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="gray" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                        <div class="mr-2 h-3.5 w-3.5 rounded-full bg-gray-400"></div>
                        Gray
                      </label>
                    </div>

                    <div class="flex items-center">
                      <input id="green" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="green" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                        <div class="mr-2 h-3.5 w-3.5 rounded-full bg-green-400"></div>
                        Green
                      </label>
                    </div>

                    <div class="flex items-center">
                      <input id="pink" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="pink" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                        <div class="mr-2 h-3.5 w-3.5 rounded-full bg-pink-400"></div>
                        Pink
                      </label>
                    </div>

                    <div class="flex items-center">
                      <input id="red" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="red" class="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                        <div class="mr-2 h-3.5 w-3.5 rounded-full bg-red-500"></div>
                        Red
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <h6 class="mb-2 text-sm font-medium text-black dark:text-white">Weight</h6>

                  <div class="space-y-2">
                    <div class="flex items-center">
                      <input id="under-1-kg" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="under-1-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Under 1 kg </label>
                    </div>

                    <div class="flex items-center">
                      <input id="1-1-5-kg" type="checkbox" value="" checked class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="1-1-5-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> 1-1,5 kg </label>
                    </div>

                    <div class="flex items-center">
                      <input id="1-5-2-kg" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="1-5-2-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> 1,5-2 kg </label>
                    </div>

                    <div class="flex items-center">
                      <input id="2-5-3-kg" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="2-5-3-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> 2,5-3 kg </label>
                    </div>

                    <div class="flex items-center">
                      <input id="over-3-kg" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />

                      <label for="over-3-kg" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Over 3 kg </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h6 class="mb-2 text-sm font-medium text-black dark:text-white">Delivery type</h6>

                <ul class="grid grid-cols-2 gap-4">
                  <li>
                    <input type="radio" id="delivery-usa" name="delivery" value="delivery-usa" class="peer hidden" checked />
                    <label for="delivery-usa" class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5">
                      <div class="block">
                        <div class="w-full text-lg font-semibold">USA</div>
                        <div class="w-full">Delivery only for USA</div>
                      </div>
                    </label>
                  </li>
                  <li>
                    <input type="radio" id="delivery-europe" name="delivery" value="delivery-europe" class="peer hidden" />
                    <label for="delivery-europe" class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5">
                      <div class="block">
                        <div class="w-full text-lg font-semibold">Europe</div>
                        <div class="w-full">Delivery only for USA</div>
                      </div>
                    </label>
                  </li>
                  <li>
                    <input type="radio" id="delivery-asia" name="delivery" value="delivery-asia" class="peer hidden" checked />
                    <label for="delivery-asia" class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5">
                      <div class="block">
                        <div class="w-full text-lg font-semibold">Asia</div>
                        <div class="w-full">Delivery only for Asia</div>
                      </div>
                    </label>
                  </li>
                  <li>
                    <input type="radio" id="delivery-australia" name="delivery" value="delivery-australia" class="peer hidden" />
                    <label for="delivery-australia" class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5">
                      <div class="block">
                        <div class="w-full text-lg font-semibold">Australia</div>
                        <div class="w-full">Delivery only for Australia</div>
                      </div>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="flex items-center space-x-4 rounded-b p-4 dark:border-gray-600 md:p-5">
            <button type="submit" class="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800">Show 50 results</button>
            <button type="reset" class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Reset</button>
          </div>
        </div>
      </div>
    </form>

  </section>`;
}

window.UserPage = UserPage;