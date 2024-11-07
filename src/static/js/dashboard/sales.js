String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const sales = async (role, page) => {
  if (!page) {
    if (role == "admin") {
      page = "/api/sale/cart/";
    }
    let warehouse_id = localStorage.getItem("warehouse_id");
    if (warehouse_id) {
      page = `/api/sale/cart/?warehouse=${warehouse_id}`;
    } else {
      page = `/api/sale/cart/`;
    }
    /* http://api.example.org/inventories/?cost_price_range_min=100&cost_price_range_max=200
      http://api.example.org/inventories/?min_stock_gte=10
        http://api.example.org/inventories/?max_stock_lte=50
        http://api.example.org/inventories/?created_at_range_after=2023-01-01&created_at_range_before=2023-12-31
        http://api.example.org/inventories/?min_stock_gte=10&max_stock_lte=50&cost_price_range_min=100&cost_price_range_max=200
     */
  }
  let warehouse_address = localStorage.getItem("warehouse_address")
  try {
    const data = await fetch(page);
    if (!data.ok) {
      DisplayMessage("Couldn't get inventory. Try again", "error");
      return null;
    }
    const response = await data.json();
    if (!response) return null;
    if (response.count == 0) {
      DisplayMessage("No Inventory Available", "warning");
      return null;
    }

    const count = response.count;
    const next = response.next;
    const previous = response.previous;
    const results = response.results;

    let html = ``;

    for (const sale of results) {

      let price = 0;
      let detail_table = "";
      let detail_dropdown = `<!-- Dropdown menu -->
        <div id="dropdown-${sale.id}"  class="hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-auto dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="${sale.id}-dropdown">`;
      sale.sales_details.forEach(detail => {
        detail_dropdown += `
              <li>
                <p class="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap dark:hover:bg-gray-600 dark:hover:text-white">
                ${detail.product_detail.name.capitalize()} X ${detail.quantity} X #${detail.bulk_price}
                </p>
              </li>`;
        if (detail.bulk_price && parseFloat(detail.bulk_price) > 0) {
          price += parseFloat(detail.bulk_price)
        }
        if (sale.status == "pending") {
          /* [384px] */
          detail_table += `
            <tr>
              <th scope="row" class="px-6 py-4 md:w-[384px] font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div class="flex items-center gap-4">
                    <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
                    <img class="h-auto w-full max-h-full" src="${detail.product_detail.files[0].file}" alt="${detail.product_detail.name}" />
                    </a>
                    <a href="#" class="hover:underline">${detail.product_detail.name}</a>
                </div>
              </th>

              <td class="p-4 text-base font-bold text-gray-900 dark:text-white">#${detail.bulk_price}</td>

              <td>
                <div class="pr-1 w-full relative flex justify-end items-center">
                  <input type="number" id="number-input" value="${detail.quantity}"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="1" />
                </div>
              </td>
              <td>
                <div class="pr-1 w-full flex justify-center items-center">
                  <button type="button" class=" text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                  </button>
                </div>
              </td>
          </tr>
          `;
        }
      });
      detail_dropdown += `
            </ul>
        </div>`;

      let sale_status = ``;
      if (sale.status == "pending") {
        sale_status += `
              <dd class="me-2 mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                <svg class="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                </svg>
                Pending
              </dd>`
      } else if (sale.status == "delivered") {
        sale_status += `
              <dd class="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                <svg class="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
                </svg>
                Confirmed
              </dd>`
      }else if (sale.status == "cancelled") {
        sale_status += `
              <dd class="me-2 mt-1.5 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                <svg class="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
                Cancelled
              </dd>`
      }else {
        sale_status += `
              <dd class="me-2 mt-1.5 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                <svg class="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
                Returned
              </dd>`
      }

      

      html += `
          <div class="flex flex-wrap items-center gap-y-4 py-6">
            <dl class="w-1/2 sm:w-1/4 md:w-auto md:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Order ID:</dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                <a href="#" class="hover:underline">${sale.sale_uuid.substring(0, 8)}</a>
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 md:w-auto md:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Date:</dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">${new Date(sale.created_at).toLocaleDateString('en-GB')}</dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 md:w-auto md:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Price:</dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">#${price}</dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 md:w-auto md:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Status:</dt>
              ${sale_status}
            </dl>

            <div class="w-full grid sm:grid-cols-2 md:flex md:w-64 md:items-center md:justify-between gap-4">
              <dl class="w-1/2 sm:w-1/4 md:w-auto md:flex-1">
                <dt class="text-base font-medium text-gray-500 dark:text-gray-400">Name:</dt>
                <p class="text-base text-gray-900 dark:text-white">${sale.customer_name.capitalize()}</p>
              </dl>
              <button data-modal-target="${sale.sale_uuid.substring(0, 8)}-detail-modal" data-modal-toggle="${sale.sale_uuid.substring(0, 8)}-detail-modal"
               class="w-full inline-flex justify-center rounded-md  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 md:w-auto">
              View details
              </button>
            </div>
          </div>`;

      /* TODO: create modal to view sale detail */
      let sale_summary = ``;
      if (sale.status == "delivered") {
        let receipt_id = null;
        const receipt_response = await fetch(`/api/sale/receipt/?search=${sale.id}`);
        
        if (!receipt_response.ok) {
          receipt_id = null;
        } else {
          let receipt = await receipt_response.json();
          receipt_id = receipt.results[0].id;
        }

        sale_summary += `
        <div id="${sale.sale_uuid.substring(0, 8)}-detail-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div class="relative p-4 w-full max-w-2xl max-h-full">
              <!-- Modal content -->
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <!-- Modal header -->
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2 ">Sale Detail <span class="hover:underline">${sale.sale_uuid.substring(0, 8)}<span> </h2>
                      
                      <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="${sale.sale_uuid.substring(0, 8)}-detail-modal">
                          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span class="sr-only">Close modal</span>
                      </button>
                  </div>
                  <!-- Modal body -->
                  <div class="p-4 md:p-5 space-y-4">
                      <dl class="sm:flex items-center justify-between gap-4">
                          <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Date</dt>
                          <dd class="font-medium text-gray-900 dark:text-white sm:text-end">${new Date(sale.created_at).toLocaleDateString('en-GB')}</dd>
                      </dl>
                      <dl class="sm:flex items-center justify-between gap-4">
                          <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Payment Method</dt>
                          <dd class="font-medium text-gray-900 dark:text-white sm:text-end">${sale.payment_method}</dd>
                      </dl>
                      <dl class="sm:flex items-center justify-between gap-4">
                          <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Name</dt>
                          <dd class="font-medium text-gray-900 dark:text-white sm:text-end">${sale.customer_name}</dd>
                      </dl>
                      <dl class="sm:flex items-center justify-between gap-4">
                          <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Address</dt>
                          <dd class="font-medium text-gray-900 dark:text-white sm:text-end">${warehouse_address}</dd>
                      </dl>
                      <dl class="sm:flex items-center justify-between gap-4">
                          <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Items</dt>
                          <dd id="${sale.id}-dropdown" data-dropdown-toggle="dropdown-${sale.id}" class="font-medium flex justify-evenly items-center text-gray-900 dark:text-white sm:text-end">
                          ${sale.sales_details.length} Products
                          <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          §<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                          </svg>
                          </dd>
                          ${detail_dropdown}
                      </dl>
                      <dl class="sm:flex items-center justify-between gap-4">
                          <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Total Price</dt>
                          <dd class="font-medium text-gray-900 dark:text-white sm:text-end">#${price}</dd>
                      </dl>
                  </div>
                  <!-- Modal footer -->
                  <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button type="button" onclick="download_receipt(${receipt_id})"
                      class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Receipt</button>
                      <button data-modal-hide="${sale.sale_uuid.substring(0, 8)}-detail-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Return</button>
                  </div>
              </div>
          </div>
      </div>`;
      } else if (sale.status == "pending") {
        sale_summary += `
        <div id="${sale.sale_uuid.substring(0, 8)}-detail-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] md:h-full">
          <div class="relative p-4 w-full max-w-3xl h-full md:h-auto">
              <!-- Modal content -->
              <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                  <!-- Modal header -->
                  <div class="flex justify-between items-center pb-4 rounded-t border-b dark:border-gray-600">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">New Sale</h3>
                      <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="${sale.sale_uuid.substring(0, 8)}-detail-modal">
                          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                          <span class="sr-only">Close modal</span>
                      </button>
                  </div>
                  <!-- Modal body -->
                  <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
                      <div id="customer_info_detail" class="space-y-4 border-b border-gray-200 py-8 dark:border-gray-700">
                          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h4>
                          <h5 class="text-base font-medium text-gray-900 dark:text-white">${sale.customer_name}</h5>
                      </div>

                      <div id="cart_info_detail" class="py-2">
                        <div class="relative border-b overflow-x-auto shadow-md sm:rounded-lg border-gray-200 dark:border-gray-800">
                            <table class="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class="width-md px-6 py-3">
                                            Product
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Price
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            QTY
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="${sale.id}_sale_items" class="divide-y divide-gray-200 dark:divide-gray-800">
                                    ${detail_table}
                                </tbody>
                            </table>
                          </div>
                          <div>
                            <dl class="flex items-center justify-between pr-1 py-2 gap-4 border-gray-200 dark:border-gray-700">
                                <dt class="text-lg font-thin text-gray-900 dark:text-white">Add Item</dt>
                                <dd class="text-lg font-thin text-gray-900 dark:text-white">

                                  <button id="${sale.id}_search_button" type="button" data-dropdown-toggle="${sale.id}_search" data-dropdown-placement="bottom-end"
                                    class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"/>
                                    </svg>
                                  </button>

                                  <!-- Dropdown menu -->
                                  <div id="${sale.id}_search" class="z-10 absolute hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                                      <div class="p-3">
                                        <label for="input-${sale.id}-search" class="sr-only">Search</label>
                                        <div class="relative">
                                          <span class="sr-only">${sale.id}</span>
                                          <input type="text" id="input-${sale.id}-search" oninput="debounceSearchProduct(${sale.id}, ${sale.id})"
                                          class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search Product">
                                        </div>
                                      </div>
                                      <ul id="${sale.id}_list" style="z-index:9999;" class=" max-h-48 h-auto px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="${sale.id}_search_button">
                                        
                                      </ul>
                                  </div>
                                </dd>
                              </dl>
                          </div>

                          <div class="space-y-4 py-8">
                              <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                                <dt class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">Total</dt>
                                <dd id="${sale.id}_sale_items_price" class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">#${parseFloat(price)}</dd>
                              </dl>

                              <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">

                                <dt class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">Payment Method</dt>
                                <dd class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">
                                  <select id="payment_method" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                                    <option selected value="Cash Payment">Cash Payment</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="POS Payment">POS Payment</option>
                                  </select>
                                </dd>
                              </dl>
                          </div>
                          <div class="gap-4 sm:flex sm:items-center">
                              <button type="button" data-modal-toggle="${sale.sale_uuid.substring(0, 8)}-detail-modal"
                                class="w-full rounded-lg  border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                                Return to Shopping
                              </button>
                              <button type="submit" class="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0">Send the order</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
      }

      html += `${sale_summary}`

    };

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

    paginator += `<nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            <span class="font-semibold text-gray-900 dark:text-white">${count}</span>
            Results
        </span>
        <ul class="inline-flex items-stretch -space-x-px">
            <li>
                <div onclick="load_products(${role || null}, ${prev_url})" 
                class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span class="sr-only">Previous</span>
                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
            </li>
            <li>
                <div onclick="load_products(${role || null}, ${prev_url})" 
                class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${prev}</div>
            </li>
            <li>
                <div onclick="load_products(${role || null}, ${nxt_url})" 
                class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${nxt}</div>
            </li>
            <li>
                <div onclick="load_products(${role || null}, ${nxt_url})" 
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

  } catch (error) {
    console.error("Error:", error);
    DisplayMessage("An error occurred", "error");
    return null;
  };

  
};

const handleSubmit = async (event, func, ...args) => {
  event.preventDefault(); // Prevent the default form submission behavior
  func(...args); // Call the specified function with the provided arguments
}


const createCart = async (warehouse_id) => {
  const name_input = document.getElementById("customer_cart")
  const customer_info = document.getElementById("customer_info_container")
  const cart_info = document.getElementById("cart_info")

  if (!name_input.value || !warehouse_id || !(parseInt(warehouse_id) > 0) ) {
    return;
  }

  const new_cart = await fetch("/api/sale/cart/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        "warehouse": warehouse_id,
        "customer_name": `${name_input.value}`
      })
  })

  if (!new_cart.ok) {
    return;
  }

  const data = await new_cart.json();

  customer_info.innerHTML = `
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h4>
      <h5 class="text-base font-medium text-gray-900 dark:text-white">${data.customer_name}</h5>
    `;

  cart_info.innerHTML = `
      <div class="relative border-b overflow-x-auto border-gray-200 dark:border-gray-800">
        <table class="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="width-md px-6 py-3">
                        Product
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Price
                    </th>
                    <th scope="col" class="px-6 py-3">
                        QTY
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Delete
                    </th>
                </tr>
            </thead>
            <tbody id="product_sale_items" class="divide-y divide-gray-200 dark:divide-gray-800">
                
            </tbody>
        </table>
      </div>
      <div>
        <dl class="flex items-center justify-between pr-1 py-2 px-2 gap-4 border-gray-200 dark:border-gray-700">
            <dt class="text-lg font-thin text-gray-900 dark:text-white">Add Item</dt>
            <dd class="text-lg font-thin text-gray-900 dark:text-white">

              <button id="product_search_button" type="button" data-dropdown-toggle="product_search" data-dropdown-placement="bottom-end"
                class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"/>
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div id="product_search" class="z-10 absolute hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                  <div class="p-3">
                    <label for="input-product-search" class="sr-only">Search</label>
                    <div class="relative">
                      <span class="sr-only">${data.id}</span>
                      <input type="text" id="input-product-search" oninput="debounceSearchProduct('product', ${data.id})"
                      class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search Product">
                    </div>
                  </div>
                  <ul id="product_list" style="z-index:9999;" class=" max-h-48 h-auto px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="product_search_button">
                    
                  </ul>
              </div>
            </dd>
          </dl>
      </div>

      <div class="space-y-4 py-8">
          <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
            <dt class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">Total</dt>
            <dd id="product_sale_items_price" class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">#0/dd>
          </dl>

          <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">

            <dt class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">Payment Method</dt>
            <dd class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">
              <select id="payment_method" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                <option selected value="Cash Payment">Cash Payment</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="POS Payment">POS Payment</option>
              </select>
            </dd>
          </dl>
      </div>


      <div class="gap-4 sm:flex sm:items-center">
          <button type="button" class="w-full rounded-lg  border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Return to Shopping</button>
          <button type="submit" class="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0">Send the order</button>
      </div>`
};


let debounceTimeout;
const debounceSearchProduct = (search_modal, cart_id) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => searchProduct(search_modal, cart_id), 1000);
}

const searchProduct = async (search_modal, cart_id) => {
    const product_list = document.getElementById(`${search_modal}_list`)
    const product_input = document.getElementById(`input-${search_modal}-search`)
    const input_value = product_input.value;

    if (input_value.length >= 3) {
      try {
        const response = await fetch(`/api/shelf/inventories/?search=${input_value}`)
        if (!response.ok) {
          return;
        }
        const data = await response.json()
        const results = data.results;

        let search_results = "";

        for (item of results) {
          if (parseInt(item.stock) <= 0) {
            continue
          }

          const files = item.product.files.map((file) => file.file);
          img_url = files.length ? files[0] : "";
          image = `<img src="${img_url}" alt="${item.product.name}-Image" class="h-8 w-auto mr-3">`;

          /* onclick="addProduct(${cart_id})" */

          search_results += `
            <li>
              <div onclick="addProduct(${cart_id}, ${item.product.id}, '${search_modal}_sale_items', '${search_modal}_sale_items_price')"
              class="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">

                  <dt class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div class="flex items-center mr-3">
                        ${image}
                        <div class="text-base font-semibold">${item.product.name}</div>
                    </div>
                  </dt>

                  <dd class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">#${item.product.selling_price}</dd>
                </dl>
              </div>
            </li>
          `;
        }

        product_list.innerHTML = search_results;

      }catch(error) {
        return;
      }
    } else {
      product_list.innerHTML = ""; // Clear the list if input length is less than 3
    }
}

const addProduct = async (cart_id, product_id, table_id, price_id) => {
    const table = document.getElementById(table_id);
    const price = document.getElementById(price_id);

    const confirm_sale_response = await fetch(`/api/sale/cart/${cart_id}`)
    if (!confirm_sale_response.ok) {
      return;
    }

    const response = await fetch(`/api/sale/detail/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          "sale": cart_id,
          "product": product_id,
        })
      });
    
    if (!response.ok) {
      return;
    }

    const data = await response.json();

    table.innerHTML +=` 
      <tr>
        <td class="whitespace-nowrap py-4 md:w-[384px]">
        <div class="flex items-center gap-4">
            <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
            <img class="h-auto w-full max-h-full" src="${data.product_detail.files[0].file}" alt="${data.product_detail.name}" />
            </a>
            <a href="#" class="hover:underline">${data.product_detail.name}”</a>
        </div>
        </td>

        <td class="p-4 text-base font-bold text-gray-900 dark:text-white">#${data.bulk_price}</td>

        <td>
          <div class="pr-1 w-full relative flex justify-end items-center">
            <input type="number" id="number-input" value="${data.quantity}"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="1" />
          </div>
        </td>
        <td>
          <div class="pr-1 w-full flex justify-center items-center">
            <button type="button" class=" text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
          </div>
        </td>
    </tr>
    `;

    const sale_response = await fetch(`/api/sale/cart/${cart_id}`)
    if (!sale_response.ok) {
      return;
    }
    const sale_data = await sale_response.json();
    let total_price = 0;
    sale_data.sales_details.forEach((item) => {
      total_price += parseFloat(item.bulk_price);
    })
    price.innerText = `#${parseFloat(total_price).toFixed(2)}`;
};

const updateProduct = async () => {}
const deleteProduct = async () => {}

const finalizeSale = (cart_id) => {};


const download_receipt = async (receipt_id) => {
  window.open(`/api/sale/receipt/${receipt_id}/generate_pdf/`, "_blank");
};



async function SalesPage(role, warehouse_id) {

  const response = await sales(role)
  let html = "";
  let results = "";
  let paginator = "";
  if (response && response.html) {
      html = response.html;
      results = response.results;
      paginator = response.paginator;
  }

  let cart_id = "what"

  return `
    <section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <div class="mx-auto max-w-screen-lg px-4 xl:px-0">
    <div class="mx-auto max-w-4xl">
      <div class="gap-4 sm:flex sm:items-center sm:justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">Sales</h2>

        <button type="button" id="createSaleButton" data-modal-toggle="createSaleModal" class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            <svg class="h-3.5 w-3.5 mr-1.5 -ml-1" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            New Sale
        </button>

        <div class="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
          <div>
            <label for="order-type" class="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select order type</label>
            <select id="order-type" class="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
              <option selected>All orders</option>
              <option value="pending">Pending</option>
              <option value="delivered">Confirmed</option>
              <option value="returned">Returned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <span class="inline-block text-gray-500 dark:text-gray-400"> from </span>

          <div>
            <label for="duration" class="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select duration</label>
            <select id="duration" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
              <option selected>this week</option>
              <option value="this month">this month</option>
              <option value="last 3 months">the last 3 months</option>
              <option value="lats 6 months">the last 6 months</option>
              <option value="this year">this year</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mt-6 flow-root sm:mt-8">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          ${html}
        </div>
      </div>

      ${paginator}
    </div>
  </div>
</section>


<div id="createSaleModal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] md:h-full">
    <div class="relative p-4 w-full max-w-3xl h-full md:h-auto">
        <!-- Modal content -->
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <!-- Modal header -->
            <div class="flex justify-between items-center pb-4 rounded-t border-b dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">New Sale</h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="createSaleModal">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div id="customer_info_container" class="space-y-4 border-b border-gray-200 py-8 dark:border-gray-700">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h4>
                    <form id="" onsubmit="handleSubmit(event, createCart, ${warehouse_id})" class="w-full flex justify-between">
                      <div class="flex">
                        <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                          </svg>
                        </span>
                        <input type="text" id="customer_cart" class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Customer Name">
                      </div>
                      <button type="submit" class="text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Submit</button>
                    </form>
                </div>

                <div id="cart_info" class="py-2">
                  <div class="gap-4 sm:flex sm:items-center">
                      <button type="button" data-modal-toggle="createSaleModal"
                        class="w-full rounded-lg border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                        Return to Shopping
                      </button>
                  </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
}

function SalesCheckout(role, sales_id) {
  return `<section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <form action="#" class="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <div class="mx-auto max-w-3xl">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Order summary</h2>

      <div class="mt-6 space-y-4 border-b border-t border-gray-200 py-8 dark:border-gray-700 sm:mt-8">
        <h4 class="text-lg sm:text-sm font-semibold text-gray-900 dark:text-white">Billing & Delivery information</h4>

        <dl>
          <dt class="text-base font-medium text-gray-900 dark:text-white">Individual</dt>
          <dd class="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">Bonnie Green - +1 234 567 890, San Francisco, California, United States, 3454, Scott Street</dd>
        </dl>

        <button type="button" data-modal-target="billingInformationModal" data-modal-toggle="billingInformationModal" class="text-base font-medium text-primary-700 hover:underline dark:text-primary-500">Edit</button>
      </div>

      <div class="mt-6 sm:mt-8">
        <div class="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
          <table class="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr>
                <td class="whitespace-nowrap py-4 md:w-[384px]">
                  <div class="flex items-center gap-4">
                    <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
                      <img class="h-auto w-full max-h-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg" alt="imac image" />
                      <img class="hidden h-auto w-full max-h-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg" alt="imac image" />
                    </a>
                    <a href="#" class="hover:underline">Apple iMac 27”</a>
                  </div>
                </td>

                <td class="p-4 text-base font-normal text-gray-900 dark:text-white">x1</td>

                <td class="p-4 text-right text-base font-bold text-gray-900 dark:text-white">$1,499</td>
              </tr>

              <tr>
                <td class="whitespace-nowrap py-4 md:w-[384px]">
                  <div class="flex items-center gap-4">
                    <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
                      <img class="h-auto w-full max-h-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg" alt="imac image" />
                      <img class="hidden h-auto w-full max-h-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-dark.svg" alt="imac image" />
                    </a>
                    <a href="#" class="hover:underline">Apple iPhone 14</a>
                  </div>
                </td>

                <td class="p-4 text-base font-normal text-gray-900 dark:text-white">x2</td>

                <td class="p-4 text-right text-base font-bold text-gray-900 dark:text-white">$1,998</td>
              </tr>

              <tr>
                <td class="whitespace-nowrap py-4 md:w-[384px]">
                  <div class="flex items-center gap-4">
                    <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
                      <img class="h-auto w-full max-h-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-light.svg" alt="ipad image" />
                      <img class="hidden h-auto w-full max-h-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-dark.svg" alt="ipad image" />
                    <a href="#" class="hover:underline">Apple iPad Air</a>
                  </div>
                </td>

                <td class="p-4 text-base font-normal text-gray-900 dark:text-white">x1</td>

                <td class="p-4 text-right text-base font-bold text-gray-900 dark:text-white">$898</td>
              </tr>

              <tr>
                <td class="whitespace-nowrap py-4 md:w-[384px]">
                  <div class="flex items-center gap-4">
                    <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
                      <img class="h-auto w-full max-h-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/xbox-light.svg" alt="xbox image" />
                      <img class="hidden h-auto w-full max-h-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/xbox-dark.svg" alt="xbox image" />
                    <a href="#" class="hover:underline">Xbox Series X</a>
                  </div>
                </td>

                <td class="p-4 text-base font-normal text-gray-900 dark:text-white">x4</td>

                <td class="p-4 text-right text-base font-bold text-gray-900 dark:text-white">$4,499</td>
              </tr>

              <tr>
                <td class="whitespace-nowrap py-4 md:w-[384px]">
                  <div class="flex items-center gap-4">
                    <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
                      <img class="h-auto w-full max-h-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-light.svg" alt="playstation image" />
                      <img class="hidden h-auto w-full max-h-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-dark.svg" alt="playstation image" />
                    <a href="#" class="hover:underline">PlayStation 5</a>
                  </div>
                </td>

                <td class="p-4 text-base font-normal text-gray-900 dark:text-white">x1</td>

                <td class="p-4 text-right text-base font-bold text-gray-900 dark:text-white">$499</td>
              </tr>

              <tr>
                <td class="whitespace-nowrap py-4 md:w-[384px]">
                  <div class="flex items-center gap-4">
                    <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
                      <img class="h-auto w-full max-h-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-light.svg" alt="macbook image" />
                      <img class="hidden h-auto w-full max-h-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-dark.svg" alt="macbook image" />
                    <a href="#" class="hover:underline">MacBook Pro 16"</a>
                  </div>
                </td>

                <td class="p-4 text-base font-normal text-gray-900 dark:text-white">x1</td>

                <td class="p-4 text-right text-base font-bold text-gray-900 dark:text-white">$499</td>
              </tr>

              <tr>
                <td class="whitespace-nowrap py-4 md:w-[384px]">
                  <div class="flex items-center gap-4">
                    <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
                      <img class="h-auto w-full max-h-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg" alt="watch image" />
                      <img class="hidden h-auto w-full max-h-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg" alt="watch image" />
                    <a href="#" class="hover:underline">Apple Watch SE</a>
                  </div>
                </td>

                <td class="p-4 text-base font-normal text-gray-900 dark:text-white">x2</td>

                <td class="p-4 text-right text-base font-bold text-gray-900 dark:text-white">$799</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 space-y-6">
          <h4 class="text-xl font-semibold text-gray-900 dark:text-white">Order summary</h4>

          <div class="space-y-4">
            <div class="space-y-2">
              <dl class="flex items-center justify-between gap-4">
                <dt class="text-gray-500 dark:text-gray-400">Original price</dt>
                <dd class="text-base font-medium text-gray-900 dark:text-white">$6,592.00</dd>
              </dl>

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-gray-500 dark:text-gray-400">Savings</dt>
                <dd class="text-base font-medium text-green-500">-$299.00</dd>
              </dl>

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-gray-500 dark:text-gray-400">Store Pickup</dt>
                <dd class="text-base font-medium text-gray-900 dark:text-white">$99</dd>
              </dl>

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-gray-500 dark:text-gray-400">Tax</dt>
                <dd class="text-base font-medium text-gray-900 dark:text-white">$799</dd>
              </dl>
            </div>

            <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">Total</dt>
              <dd class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">$7,191.00</dd>
            </dl>
          </div>

          <div class="flex items-start sm:items-center">
            <input id="terms-checkbox-2" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />
            <label for="terms-checkbox-2" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> I agree with the <a href="#" title="" class="text-primary-700 underline hover:no-underline dark:text-primary-500">Terms and Conditions</a> of use of the Flowbite marketplace </label>
          </div>

          <div class="gap-4 sm:flex sm:items-center">
            <button type="button" class="w-full rounded-lg  border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Return to Shopping</button>

            <button type="submit" class="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0">Send the order</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</section>

<div id="billingInformationModal" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="antialiased fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-auto w-full max-h-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0">
  <div class="relative max-h-auto w-full max-h-full max-w-lg p-4">
    <!-- Modal content -->
    <div class="relative rounded-lg bg-white shadow dark:bg-gray-800">
      <!-- Modal header -->
      <div class="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
        <h3 class="text-lg sm:text-sm font-semibold text-gray-900 dark:text-white">Billing Information</h3>
        <button type="button" class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="billingInformationModal">
          <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <form class="p-4 md:p-5">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-5">
          <div class="flex items-center gap-4 sm:col-span-2">
            <div class="flex items-center">
              <input id="company_address_billing_modal" data-collapse-toggle="company-info-container-modal" aria-expanded="false" type="checkbox" value="" name="address-type-modal" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />
              <label for="company_address_billing_modal" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Order as a company </label>
            </div>
          </div>
  
          <div class="grid hidden grid-cols-2 gap-4 sm:col-span-2" id="company-info-container-modal">
            <div>
              <label for="company_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Company name </label>
              <input type="text" id="company_name" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Flowbite LLC" />
            </div>
  
            <div>
              <label for="vat_number" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> VAT number </label>
              <input type="text" id="vat_number" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="DE42313253" />
            </div>
          </div>
  
          <div class="sm:col-span-2">
            <div class="mb-2 flex items-center gap-1">
              <label for="saved-address-modal" class="block text-sm font-medium text-gray-900 dark:text-white"> Saved Address </label>
              <svg data-tooltip-target="saved-address-modal-desc-2" data-tooltip-trigger="hover" class="h-4 w-4 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
              </svg>
            </div>
            <select id="saved-address-modal" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
              <option selected>Choose one of your saved address</option>
              <option value="address-1">San Francisco, California, United States, 3454, Scott Street</option>
              <option value="address-2">New York, United States, Broadway 10012</option>
            </select>
            <div id="saved-address-modal-desc-2" role="tooltip" class="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
              Choose one of your saved addresses
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
  
          <div>
            <label for="first_name_billing_modal" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> First Name* </label>
            <input type="text" id="first_name_billing_modal" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Enter your first name" required />
          </div>
  
          <div>
            <label for="last_name_billing_modal" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Last Name* </label>
            <input type="text" id="last_name_billing_modal" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Enter your last name" required />
          </div>
  
          <div class="sm:col-span-2">
            <label for="phone-input_billing_modal" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone Number* </label>
            <div class="flex items-center">
              <button id="dropdown_phone_input__button_billing_modal" data-dropdown-toggle="dropdown_phone_input_billing_modal" class="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700" type="button">
                <svg fill="none" aria-hidden="true" class="me-2 h-4 w-4" viewBox="0 0 20 15">
                  <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                  <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                    <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                  </mask>
                  <g mask="url(#a)">
                    <path fill="#D02F44" fill-rule="evenodd" d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z" clip-rule="evenodd" />
                    <path fill="#46467F" d="M0 .5h8.4v6.533H0z" />
                    <g filter="url(#filter0_d_343_121520)">
                      <path
                        fill="url(#paint0_linear_343_121520)"
                        fill-rule="evenodd"
                        d="M1.867 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.866 0a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM7.467 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zM2.333 3.3a.467.467 0 100-.933.467.467 0 000 .933zm2.334-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.4.467a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm-2.334.466a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.466a.467.467 0 11-.933 0 .467.467 0 01.933 0zM1.4 4.233a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM6.533 4.7a.467.467 0 11-.933 0 .467.467 0 01.933 0zM7 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zM3.267 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0z"
                        clip-rule="evenodd"
                      />
                    </g>
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_343_121520" x1=".933" x2=".933" y1="1.433" y2="6.1" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#fff" />
                      <stop offset="1" stop-color="#F0F0F0" />
                    </linearGradient>
                    <filter id="filter0_d_343_121520" width="6.533" height="5.667" x=".933" y="1.433" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="1" />
                      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_343_121520" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow_343_121520" result="shape" />
                    </filter>
                  </defs>
                </svg>
                +1
                <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                </svg>
              </button>
              <div id="dropdown_phone_input_billing_modal" class="z-10 hidden w-56 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700">
                <ul class="p-2 text-sm font-medium text-gray-700 dark:text-gray-200" aria-labelledby="dropdown_phone_input__button_billing_modal">
                  <li>
                    <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                      <span class="inline-flex items-center">
                        <svg fill="none" aria-hidden="true" class="me-2 h-4 w-4" viewBox="0 0 20 15">
                          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                            <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          </mask>
                          <g mask="url(#a)">
                            <path fill="#D02F44" fill-rule="evenodd" d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z" clip-rule="evenodd" />
                            <path fill="#46467F" d="M0 .5h8.4v6.533H0z" />
                            <g filter="url(#filter0_d_343_121520)">
                              <path
                                fill="url(#paint0_linear_343_121520)"
                                fill-rule="evenodd"
                                d="M1.867 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.866 0a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM7.467 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zM2.333 3.3a.467.467 0 100-.933.467.467 0 000 .933zm2.334-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.4.467a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm-2.334.466a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.466a.467.467 0 11-.933 0 .467.467 0 01.933 0zM1.4 4.233a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM6.533 4.7a.467.467 0 11-.933 0 .467.467 0 01.933 0zM7 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zM3.267 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0z"
                                clip-rule="evenodd"
                              />
                            </g>
                          </g>
                          <defs>
                            <linearGradient id="paint0_linear_343_121520" x1=".933" x2=".933" y1="1.433" y2="6.1" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#fff" />
                              <stop offset="1" stop-color="#F0F0F0" />
                            </linearGradient>
                            <filter id="filter0_d_343_121520" width="6.533" height="5.667" x=".933" y="1.433" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                              <feOffset dy="1" />
                              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                              <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_343_121520" />
                              <feBlend in="SourceGraphic" in2="effect1_dropShadow_343_121520" result="shape" />
                            </filter>
                          </defs>
                        </svg>
                        United States (+1)
                      </span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                      <span class="inline-flex items-center">
                        <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 20 15">
                          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                            <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          </mask>
                          <g mask="url(#a)">
                            <path fill="#0A17A7" d="M0 .5h19.6v14H0z" />
                            <path fill="#fff" fill-rule="evenodd" d="M-.898-.842L7.467 4.8V-.433h4.667V4.8l8.364-5.642L21.542.706l-6.614 4.46H19.6v4.667h-4.672l6.614 4.46-1.044 1.549-8.365-5.642v5.233H7.467V10.2l-8.365 5.642-1.043-1.548 6.613-4.46H0V5.166h4.672L-1.941.706-.898-.842z" clip-rule="evenodd" />
                            <path stroke="#DB1F35" stroke-linecap="round" stroke-width=".667" d="M13.067 4.933L21.933-.9M14.009 10.088l7.947 5.357M5.604 4.917L-2.686-.67M6.503 10.024l-9.189 6.093" />
                            <path fill="#E6273E" fill-rule="evenodd" d="M0 8.9h8.4v5.6h2.8V8.9h8.4V6.1h-8.4V.5H8.4v5.6H0v2.8z" clip-rule="evenodd" />
                          </g>
                        </svg>
                        United Kingdom (+44)
                      </span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                      <span class="inline-flex items-center">
                        <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
                          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                            <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          </mask>
                          <g mask="url(#a)">
                            <path fill="#0A17A7" d="M0 .5h19.6v14H0z" />
                            <path fill="#fff" stroke="#fff" stroke-width=".667" d="M0 .167h-.901l.684.586 3.15 2.7v.609L-.194 6.295l-.14.1v1.24l.51-.319L3.83 5.033h.73L7.7 7.276a.488.488 0 00.601-.767L5.467 4.08v-.608l2.987-2.134a.667.667 0 00.28-.543V-.1l-.51.318L4.57 2.5h-.73L.66.229.572.167H0z" />
                            <path fill="url(#paint0_linear_374_135177)" fill-rule="evenodd" d="M0 2.833V4.7h3.267v2.133c0 .369.298.667.666.667h.534a.667.667 0 00.666-.667V4.7H8.2a.667.667 0 00.667-.667V3.5a.667.667 0 00-.667-.667H5.133V.5H3.267v2.333H0z" clip-rule="evenodd" />
                            <path fill="url(#paint1_linear_374_135177)" fill-rule="evenodd" d="M0 3.3h3.733V.5h.934v2.8H8.4v.933H4.667v2.8h-.934v-2.8H0V3.3z" clip-rule="evenodd" />
                            <path
                              fill="#fff"
                              fill-rule="evenodd"
                              d="M4.2 11.933l-.823.433.157-.916-.666-.65.92-.133.412-.834.411.834.92.134-.665.649.157.916-.823-.433zm9.8.7l-.66.194.194-.66-.194-.66.66.193.66-.193-.193.66.193.66-.66-.194zm0-8.866l-.66.193.194-.66-.194-.66.66.193.66-.193-.193.66.193.66-.66-.193zm2.8 2.8l-.66.193.193-.66-.193-.66.66.193.66-.193-.193.66.193.66-.66-.193zm-5.6.933l-.66.193.193-.66-.193-.66.66.194.66-.194-.193.66.193.66-.66-.193zm4.2 1.167l-.33.096.096-.33-.096-.33.33.097.33-.097-.097.33.097.33-.33-.096z"
                              clip-rule="evenodd"
                            />
                          </g>
                          <defs>
                            <linearGradient id="paint0_linear_374_135177" x1="0" x2="0" y1=".5" y2="7.5" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#fff" />
                              <stop offset="1" stop-color="#F0F0F0" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_374_135177" x1="0" x2="0" y1=".5" y2="7.033" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#FF2E3B" />
                              <stop offset="1" stop-color="#FC0D1B" />
                            </linearGradient>
                          </defs>
                        </svg>
                        Australia (+61)
                      </span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                      <span class="inline-flex items-center">
                        <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 20 15">
                          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                            <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          </mask>
                          <g mask="url(#a)">
                            <path fill="#262626" fill-rule="evenodd" d="M0 5.167h19.6V.5H0v4.667z" clip-rule="evenodd" />
                            <g filter="url(#filter0_d_374_135180)">
                              <path fill="#F01515" fill-rule="evenodd" d="M0 9.833h19.6V5.167H0v4.666z" clip-rule="evenodd" />
                            </g>
                            <g filter="url(#filter1_d_374_135180)">
                              <path fill="#FFD521" fill-rule="evenodd" d="M0 14.5h19.6V9.833H0V14.5z" clip-rule="evenodd" />
                            </g>
                          </g>
                          <defs>
                            <filter id="filter0_d_374_135180" width="19.6" height="4.667" x="0" y="5.167" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                              <feOffset />
                              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                              <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_374_135180" />
                              <feBlend in="SourceGraphic" in2="effect1_dropShadow_374_135180" result="shape" />
                            </filter>
                            <filter id="filter1_d_374_135180" width="19.6" height="4.667" x="0" y="9.833" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                              <feOffset />
                              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                              <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_374_135180" />
                              <feBlend in="SourceGraphic" in2="effect1_dropShadow_374_135180" result="shape" />
                            </filter>
                          </defs>
                        </svg>
                        Germany (+49)
                      </span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                      <span class="inline-flex items-center">
                        <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 20 15">
                          <rect width="19.1" height="13.5" x=".25" y=".75" fill="#fff" stroke="#F5F5F5" stroke-width=".5" rx="1.75" />
                          <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                            <rect width="19.1" height="13.5" x=".25" y=".75" fill="#fff" stroke="#fff" stroke-width=".5" rx="1.75" />
                          </mask>
                          <g mask="url(#a)">
                            <path fill="#F44653" d="M13.067.5H19.6v14h-6.533z" />
                            <path fill="#1035BB" fill-rule="evenodd" d="M0 14.5h6.533V.5H0v14z" clip-rule="evenodd" />
                          </g>
                        </svg>
                        France (+33)
                      </span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                      <span class="inline-flex items-center">
                        <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 20 15">
                          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                            <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                          </mask>
                          <g mask="url(#a)">
                            <path fill="#262626" fill-rule="evenodd" d="M0 5.167h19.6V.5H0v4.667z" clip-rule="evenodd" />
                            <g filter="url(#filter0_d_374_135180)">
                              <path fill="#F01515" fill-rule="evenodd" d="M0 9.833h19.6V5.167H0v4.666z" clip-rule="evenodd" />
                            </g>
                            <g filter="url(#filter1_d_374_135180)">
                              <path fill="#FFD521" fill-rule="evenodd" d="M0 14.5h19.6V9.833H0V14.5z" clip-rule="evenodd" />
                            </g>
                          </g>
                          <defs>
                            <filter id="filter0_d_374_135180" width="19.6" height="4.667" x="0" y="5.167" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                              <feOffset />
                              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                              <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_374_135180" />
                              <feBlend in="SourceGraphic" in2="effect1_dropShadow_374_135180" result="shape" />
                            </filter>
                            <filter id="filter1_d_374_135180" width="19.6" height="4.667" x="0" y="9.833" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                              <feOffset />
                              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                              <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_374_135180" />
                              <feBlend in="SourceGraphic" in2="effect1_dropShadow_374_135180" result="shape" />
                            </filter>
                          </defs>
                        </svg>
                        Germany (+49)
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
              <div class="relative w-full">
                <input type="text" id="phone-input" class="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="123-456-7890" required />
              </div>
            </div>
          </div>

          <div>
            <div class="mb-2 flex items-center gap-2">
              <label for="select_country_input_billing_modal" class="block text-sm font-medium text-gray-900 dark:text-white"> Country* </label>
            </div>
            <select id="select_country_input_billing_modal" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
              <option selected>United States</option>
              <option value="AS">Australia</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
              <option value="UK">United Kingdom</option>
            </select>
          </div>
  
          <div>
            <div class="mb-2 flex items-center gap-2">
              <label for="select_city_input_billing_modal" class="block text-sm font-medium text-gray-900 dark:text-white"> City* </label>
            </div>
            <select id="select_city_input_billing_modal" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
              <option selected>San Francisco</option>
              <option value="NY">New York</option>
              <option value="LA">Los Angeles</option>
              <option value="CH">Chicago</option>
              <option value="HU">Houston</option>
            </select>
          </div>
  
          <div class="sm:col-span-2">
            <label for="address_billing_modal" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Shipping Address* </label>
            <textarea id="address_billing_modal" rows="4" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Enter here your address"></textarea>
          </div>

        </div>
        <div class="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
          <button type="submit" class="me-2 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save information</button>
          <button type="button" data-modal-toggle="billingInformationModal" class="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</div>`;
}

function SaleSummary() {
  return `
    <section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <div class="mx-auto max-w-2xl px-4 2xl:px-0">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">Thanks for your order!</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">Your order <a href="#" class="font-medium text-gray-900 dark:text-white hover:underline">#7564804</a> will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.</p>
      <div class="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Date</dt>
              <dd class="font-medium text-gray-900 dark:text-white sm:text-end">14 May 2024</dd>
          </dl>
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Payment Method</dt>
              <dd class="font-medium text-gray-900 dark:text-white sm:text-end">JPMorgan monthly installments</dd>
          </dl>
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Name</dt>
              <dd class="font-medium text-gray-900 dark:text-white sm:text-end">Flowbite Studios LLC</dd>
          </dl>
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Address</dt>
              <dd class="font-medium text-gray-900 dark:text-white sm:text-end">34 Scott Street, San Francisco, California, USA</dd>
          </dl>
          <dl class="sm:flex items-center justify-between gap-4">
              <dt class="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Phone</dt>
              <dd class="font-medium text-gray-900 dark:text-white sm:text-end">+(123) 456 7890</dd>
          </dl>
      </div>
      <div class="flex items-center space-x-4">
          <a href="#" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Track your order</a>
          <a href="#" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Return to shopping</a>
      </div>
  </div>
</section>`;
}

window.SalesPage = SalesPage;
