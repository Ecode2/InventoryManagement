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
            <tr id="${detail.id}-${detail.product_detail.id}">
              <th scope="row" class="px-6 py-4  font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                  <input type="number" min="1" oninput="debounceUpdateProduct(this, ${detail.id}, '${detail.id}-${detail.product_detail.id}', '${sale.id}-sale-items-price', ${sale.id})" value="${detail.quantity}"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="1" />
                </div>
              </td>
              <td>
                <div class="pr-1 w-full flex justify-center items-center">
                  <button type="button" onclick="deleteProduct(${detail.id}, '${detail.id}-${detail.product_detail.id}', '${sale.id}-sale-items-price', ${sale.id})"
                  class=" text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
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

          if (receipt.count > 0) {
            receipt_id = receipt.results[0].id;

          } else {
            const new_receipt_response = await fetch(`/api/sale/receipt/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
              },
              body: JSON.stringify({
                "sale": sale.id,
                "payment_method": sale.payment_method
              })
            })
          
            let new_receipt = await new_receipt_response.json();
            receipt_id = new_receipt.id;
          }
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
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
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
                  <div class="flex items-center w-full justify-evenly p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button type="button" onclick="download_receipt(${receipt_id})"
                          class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                          Receipt
                      </button>
                      <button data-modal-hide="${sale.sale_uuid.substring(0, 8)}-detail-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Close</button>
                      <button type="button" onclick="deleteCart(${sale.id})"
                          class="rounded-lg border border-red-700 py-2.5 px-5 ms-3 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900">
                          Delete
                      </button>
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
                                <tbody id="${sale.id}-sale-items" class="divide-y divide-gray-200 dark:divide-gray-800">
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
                                <dd id="${sale.id}-sale-items-price" class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">#${parseFloat(price)}</dd>
                              </dl>

                              <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">

                                <dt class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">Payment Method</dt>
                                <dd class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">
                                  <select id="payment_${sale.id}_method" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
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
                                Close
                              </button>
                              <button type="button" onclick="calcelCart(${sale.id})"
                                class="w-full rounded-md border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 md:w-auto">
                                Cancel
                              </button>
                              <button type="submit" onclick="finalizeSale(${sale.id}, 'payment_${sale.id}_method')" data-modal-toggle="${sale.sale_uuid.substring(0, 8)}-detail-modal"
                                class="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0">
                                Sell 
                              </button>
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
            <tbody id="product-sale-items" class="divide-y divide-gray-200 dark:divide-gray-800">
                
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
            <dd id="product-sale-items-price" class="text-lg sm:text-sm font-bold text-gray-900 dark:text-white">#0 </dd>
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
          <button type="button" data-modal-toggle="createSaleModal"
            class="w-full rounded-lg  border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
            Close
          </button>
          
          <button type="button" onclick="calcelCart(${data.id})"
            class="w-full rounded-md border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 md:w-auto">
            Cancel
          </button>

          <button type="submit" onclick="finalizeSale(${data.id}, 'payment_method')"
            class="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0">
            Sell
          </button>
      </div>`
};

const calcelCart = async (cart_id) => {
  popup = confirm("Delete Current Cart ?")
  if (popup) {
      try {
          const new_cart = await fetch(`/api/sale/cart/${cart_id}/`, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                "status": "cancelled"
              })
          });

          if (!new_cart.ok) {
            DisplayMessage("Couldn't delete cart. Try again", "error");
            return;
          }
          window.location.reload();
          DisplayMessage("Sale canceled", "info");

      } catch (error) {
        DisplayMessage("Couldn't delete. Try again", "error");
      }
  }
};

const deleteCart = async (cart_id) => {
  popup = confirm("Delete Current Cart ?")
  console.log(popup)
  if (popup) {
      try {
          const new_cart = await fetch(`/api/sale/cart/${cart_id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCookie('csrftoken')
            }
          })

          if (!new_cart.ok) {
            console.log(new_cart)
            DisplayMessage("Couldn't delete cart. Try again", "error");
            return;
          }
          window.location.reload();
          DisplayMessage("Cart Deleted", "info");

      } catch (error) {
        console.log(error)
        DisplayMessage("Couldn't delete. Try again", "error");
      }
  }
}


const finalizeSale = async (cart_id, payment_id) => {
  const payment_method = document.getElementById(payment_id);

  const confirm_sale_response = await fetch(`/api/sale/cart/${cart_id}`)
    if (!confirm_sale_response.ok) {
      DisplayMessage("Couldn't get cart. Try again", "error");
      return;
    }
  
  const response = await fetch(`/api/sale/cart/${cart_id}/`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
        "payment_method": payment_method.value,
        "status": "delivered"
      })
  });

  if (!response.ok) {
    DisplayMessage("Couldn't complete sale. Try again", "error");
    return;
  }

  const data = response.json()

  const receipt_response = await fetch(`/api/sale/receipt/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      "sale": cart_id,
      "payment_method": data.payment_method
    })
  })

  let receipt = await receipt_response.json();

  window.location.reload();
  download_receipt(receipt.id)
  DisplayMessage("Sale completed", "info");

};


const download_receipt = async (receipt_id) => {
  window.open(`/api/sale/receipt/${receipt_id}/generate_pdf/`, "_blank");
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
              <div onclick="addProduct('${cart_id}', ${item.product.id}, '${search_modal}-sale-items', '${search_modal}-sale-items-price')"
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
      DisplayMessage("Couldn't get cart. Try again", "error");
      return;
    }
    /* /api/shelf/inventories/?search=1 */

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
      DisplayMessage("Couldn't create product. Try again", "error");
      return;
    }

    const data = await response.json();

    table.innerHTML +=` 
      <tr id="${data.id}-${data.product_detail.id}">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          <div class="flex items-center gap-4">
              <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
              <img class="h-auto w-full max-h-full" src="${data.product_detail.files[0].file}" alt="${data.product_detail.name}" />
              </a>
              <a href="#" class="hover:underline">${data.product_detail.name}</a>
          </div>
        </th>

        <td class="p-4 text-base font-bold text-gray-900 dark:text-white">#${data.bulk_price}</td>

        <td>
          <div class="pr-1 w-full relative flex justify-end items-center">
            <input type="number" min="1" oninput="updateProduct(this, ${data.id}, '${data.id}-${data.product_detail.id}', '${price_id}', '${cart_id}')" value="${data.quantity}"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="1" />
          </div>
        </td>
        <td>
          <div class="pr-1 w-full flex justify-center items-center">
            <button type="button" onclick="deleteProduct(${data.id}, '${data.id}-${data.product_detail.id}', '${price_id}', '${cart_id}')"
            class=" text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
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
let debounceUpdateTimeout;
const debounceUpdateProduct = (quantity, sale_detail_id, row_id, price_id, cart_id) => {
  clearTimeout(debounceUpdateTimeout);
  debounceUpdateTimeout = setTimeout(() => updateProduct(quantity, sale_detail_id, row_id, price_id, cart_id), 1000);
}
const updateProduct = async (quantity, sale_detail_id, row_id, price_id, cart_id) => {
  const row = document.getElementById(row_id);
  const price = document.getElementById(price_id);
  const qty = quantity.value;

    const confirm_sale_response = await fetch(`/api/sale/cart/${cart_id}`)
    if (!confirm_sale_response.ok) {
      DisplayMessage("Couldn't get cart. Try again", "error");
      return;
    }

    const response = await fetch(`/api/sale/detail/${sale_detail_id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ "quantity": parseInt(qty)})
      });
    
    if (!response.ok) {
      DisplayMessage("Couldn't update. Try again", "error");
      return;
    }

    const data = await response.json();

    row.innerHTML =`
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          <div class="flex items-center gap-4">
              <a href="#" class="flex items-center aspect-square w-10 h-10 shrink-0">
              <img class="h-auto w-full max-h-full" src="${data.product_detail.files[0].file}" alt="${data.product_detail.name}" />
              </a>
              <a href="#" class="hover:underline">${data.product_detail.name}</a>
          </div>
        </th>

        <td class="p-4 text-base font-bold text-gray-900 dark:text-white">#${data.bulk_price}</td>

        <td>
          <div class="pr-1 w-full relative flex justify-end items-center">
            <input type="number" min="1" oninput="debounceUpdateProduct(this, ${data.id}, '${data.id}-${data.product_detail.id}', '${price_id}', '${cart_id}')" value="${data.quantity}"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="1" />
          </div>
        </td>
        <td>
          <div class="pr-1 w-full flex justify-center items-center">
            <button type="button" onclick="deleteProduct(${data.id}, '${row_id}', '${price_id}', '${cart_id}')"
              class=" text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
          </div>
        </td>`;

    const sale_response = await fetch(`/api/sale/cart/${cart_id}`)
    if (!sale_response.ok) {
      DisplayMessage("Couldn't update product. Try again", "error");
      return;
    }
    const sale_data = await sale_response.json();
    let total_price = 0;
    sale_data.sales_details.forEach((item) => {
      total_price += parseFloat(item.bulk_price);
    })
    price.innerText = `#${parseFloat(total_price).toFixed(2)}`;
}
const deleteProduct = async (detail_id, row_id, price_id, cart_id) => {
  const row = document.getElementById(row_id);
  const price = document.getElementById(price_id);

    const confirm_sale_response = await fetch(`/api/sale/cart/${cart_id}`)
    if (!confirm_sale_response.ok) {
      DisplayMessage("Couldn't get cart. Try again", "error");
      return;
    }

    const response = await fetch(`/api/sale/detail/${detail_id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      }
    });
    
    if (!response.ok) {
      DisplayMessage("Couldn't Delete. Try again", "error");
      return;
    }

    row.remove()

    const sale_response = await fetch(`/api/sale/cart/${cart_id}`)
    if (!sale_response.ok) {
      DisplayMessage("Couldn't update product. Try again", "error");
      return;
    }
    const sale_data = await sale_response.json();
    let total_price = 0;
    sale_data.sales_details.forEach((item) => {
      total_price += parseFloat(item.bulk_price);
    })
    price.innerText = `#${parseFloat(total_price).toFixed(2)}`;
}



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
                        <button type="submit" onclick="createCart('${warehouse_id}')"
                          class="text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
                          Submit
                        </button>
                    </form>
                </div>

                <div id="cart_info" class="py-2">
                  <div class="gap-4 sm:flex sm:items-center">
                      <button type="button" data-modal-toggle="createSaleModal"
                        class="w-full rounded-lg border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                        Close
                      </button>
                  </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
}


window.SalesPage = SalesPage;
