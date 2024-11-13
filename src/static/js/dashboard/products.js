const products = async (role, page) => {
    if (!page) {
      page = "/api/shelf/products/"
    }
    try {
        const data = await fetch(page)
        if (!data.ok) {
          DisplayMessage("Couldn't get products. Try again", "error");
          return null;
        }
        
        const response = await data.json();

        if (response.count == 0) {
          DisplayMessage("No Products Available", "warning");
          return null;
        }

        const count = response.count;
        const next = response.next;
        const previous = response.previous;
        const results = response.results;

        html = ``;
        for (let product of results) {
            const categories = product.category.map((category) => category.name);
            const files = product.files.map((file) => file.file);

            cost = ``;
            cost_float = parseFloat(product.cost_price).toFixed(2);
            selling_float = parseFloat(product.selling_price).toFixed(2);

            if (role === "admin") {
              cost += `<li class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">${cost_float}</p>
                  </li>`;
            }

            image = files[0];

            let preview_images = files.length ? `
            <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                <img src="${files[0]}" alt="${product.name}-Image">
            </div>
            ` : '';

            for (let img_file of files.slice(1)) {
                preview_images += `
                    <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                        <img src="${img_file}" alt="${product.name}-Image">
                    </div>`;
            }

            let category = ``;
            if (categories) {
              category += `<span class="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> ${categories[0]} </span>`;
              if (categories.length > 1) {
                category += `<span class="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> ${categories[1]} </span>`;
              }
            }

            let all_categories = category
            for (let category in categories.slice(2)) {
                all_categories += `<span class="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">${category}</span>`
            }

            let dimension = `<div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Dimensions (cm)</dt>
            <dd class="text-gray-500 dark:text-gray-400">`;

            let product_weight = "";

            dimension += product.height? product.height : '';
            dimension += product.width? ' X '+product.width : '';
            dimension += product.depth? ' X '+product.depth : '';
            dimension += `</dd>
                </div>`;
            if (!product.height || !product.width){dimension="";}

            if (product.weight) {
                product_weight = `
                <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                    <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Item weight (kg)</dt>
                    <dd class="text-gray-500 dark:text-gray-400">${product.weight}</dd>
                </div>`;
            }

            let preview_cost = ``;
            let preview_update = "";
            let preview_delete = "";
            if (role == "admin") {
                preview_cost = ` 
                      <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Cost Price</dt>
                            <dd class="text-gray-500 dark:text-gray-400">
                                #${product.cost_price}
                            </dd>
                        </div>`
                /* preview_update = `
                    <button type="button" data-drawer-target="update-product-${product.id}" data-drawer-show="update-product-${product.id}"
                            aria-controls="update-product-${product.id}" class="text-white w-full inline-flex items-center justify-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            <svg aria-hidden="true" class="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                            </svg>
                            Edit
                    </button>`;
                preview_delete = `
                    <button type="button" data-modal-target="delete-${product.id}-modal" data-modal-toggle="delete-${product.id}-modal" 
                            class="inline-flex w-full items-center text-white justify-center bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            <svg aria-hidden="true" class="w-5 h-5 mr-1.5 -ml-1" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                            </svg>
                            Delete
                        </button>`; */

            }
            
            preview_modal = `
                <!-- Preview Drawer -->
                <div id="read-product-${product.id}-advanced" class="overflow-y-auto fixed top-0 left-0 z-50 p-4 w-full max-w-lg h-screen bg-white transition-transform -translate-x-full dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-label" aria-hidden="true">
                    <div>
                        <h4 id="read-drawer-${product.id}-label" class="mb-1.5 leading-none flex w-full justify-start space-x-4 text-xl font-semibold text-gray-900 dark:text-white">
                            <span>${product.name}</span>
                            <a href="#" class="hover:underline">${product.sku.substring(0, 8)}</a>
                        </h4>
                    </div>
                    <button type="button" data-drawer-dismiss="read-product-${product.id}-advanced" aria-controls="read-product-${product.id}-advanced" 
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only">Close menu</span>
                    </button>
                    <div class="grid grid-cols-3 gap-4 mb-4 sm:mb-5">
                        ${preview_images}
                    </div>
                    <dl class="sm:mb-5">
                        <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Details</dt>
                        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"> ${product.description} </dd>
                    </dl>
                    <dl class="sm:mb-5">
                        <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Selling Quantity</dt>
                        <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">#${product.selling_price} For ${product.recorder_quantity} ${product.recorder_quantity_name}  </dd>
                    </dl>
                    <dl class="grid grid-cols-2 gap-4 mb-4">
                        ${preview_cost}
                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Selling Price</dt>
                            <dd class="text-gray-500 dark:text-gray-400">
                                #${product.selling_price}
                            </dd>
                        </div>

                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Category</dt>
                            <dd class="text-gray-500 dark:text-gray-400">
                                ${all_categories}
                            </dd>
                        </div>
                        ${dimension}
                        ${product_weight}
                    </dl>
                    <div class="flex bottom-0 left-0 justify-center pb-4 space-x-4 w-full">
                        ${preview_update}
                        ${preview_delete}
                    </div>
                </div>`;



            html += `
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <span id="${product.id}" class="sr-only">${product.sku}</span>
                <div class="h-56 w-full">
                    <img class="mx-auto h-full" src="${image}" alt="${product.id}-${product.name}" />
                </div>
                <div class="pt-6">
                  <div class="mb-4 flex items-center justify-between gap-4">
                    ${category}
                    <div class="flex items-center justify-end gap-1">
                      <button type="button" data-tooltip-target="tooltip-quick-look" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span class="sr-only"> Quick look </span>
                        <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                          <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                      <div id="tooltip-quick-look" role="tooltip" class="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700" data-popper-placement="top">
                        Quick look
                        <div class="tooltip-arrow" data-popper-arrow=""></div>
                      </div>
                    </div>
                  </div>

                  <div data-drawer-target="read-product-${product.id}-advanced" data-drawer-show="read-product-${product.id}-advanced"
                        aria-controls="read-product-${product.id}-advanced"
                      class="text-lg font-semibold flex w-full justify-between leading-tight text-gray-900 hover:underline dark:text-white">
                  <span>${product.name}</span>
                  <span class="hover:underline">${product.sku.substring(0, 8)}</span>
                  </div>

                  <ul class="mt-2 flex items-center gap-4">
                    <li class="flex items-center gap-2">
                      <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                      </svg>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">${product.recorder_quantity} ${product.recorder_quantity_name}</p>
                    </li>
                    ${cost}
                  </ul>

                  <div class="mt-4 flex items-center justify-between gap-4">
                    <p class="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">NGN ${selling_float}</p>

                    <button type="button"
                        data-drawer-target="read-product-${product.id}-advanced" data-drawer-show="read-product-${product.id}-advanced"
                        aria-controls="read-product-${product.id}-advanced"
                        class="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                          <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      Detail
                    </button>
                  </div>
                </div>
              </div>
                `;

            html += preview_modal;

            };

        paginator = ``;
        let prev = ""
        let prev_url = previous
        let nxt = ""
        let nxt_url = next

        if (previous) {
          let prevRegex = /[?&]page=(\d+)/;
          let match = url.match(prevRegex);
          if (match) {
            prev = match[1];
          }
        } else {
          prev_url = null
        }

        if (next) {
          let nxtRegex = /[?&]page=(\d+)/;
          let match = url.match(nxtRegex);
          if (match) {
            nxt = match[1];
          }
        } else {
          nxt_url = null
        }

        paginator += `<nav class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 p-4" aria-label="Table navigation">
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                      <span class="font-semibold text-gray-900 dark:text-white">${count}</span>
                      Results
                  </span>
                  <ul class="inline-flex items-stretch -space-x-px">
                      <li>
                          <div onclick="load_products('${role || null}', '${prev_url}')" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                              <span class="sr-only">Previous</span>
                              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                          </div>
                      </li>
                      <li>
                          <div onclick="load_products('${role || null}', '${prev_url}')" class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${prev}</div>
                      </li>
                      <li>
                          <div onclick="load_products('${role || null}', '${nxt_url}')" class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${nxt}</div>
                      </li>
                      <li>
                          <div onclick="load_products('${role || null}', '${nxt_url}')" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                              <span class="sr-only">Next</span>
                              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                              </svg>
                          </div>
                      </li>
                  </ul>
              </nav>`;

        return { html, count, next, previous, results, paginator };

    } catch(error)  {
        DisplayMessage(`An error occurred ${error}`, "error");
        return null;
      };
};

/* const categories = async () => {
    try {
      const data = await fetch("/api/shelf/categories/")
      if (!data.ok) {
        DisplayMessage("No Category Registered", "error");
        return "";
      }

      let response = await data.json();
      if (!response.results) {
        DisplayMessage("No Category Registered", "error");
        return "";
      }

      const count = response.count;
      const next = response.next;
      const previous = response.previous;
      const results = response.results;

      html = ``;
      results.forEach((category) => {
        html += `
            <li class="flex items
            `;
      });
      return html, count, next, previous, results;

    }catch(error){
      console.error("Error:", error);
      DisplayMessage("An error occurred", "error");
      return;
    };
}; */

let debounceProductTimeout;
const debounceGetProduct = (search_input, role) => {
  clearTimeout(debounceProductTimeout);
  debounceProductTimeout = setTimeout(() => getProduct(search_input, role), 1000);
}
const getProduct = async (search_input, role) => {
  const input_value = search_input.value;

  if (input_value.length >= 3) {
    // search for the item
    load_products(role, `/api/shelf/products/?search=${input_value}`)
  } else {
    // load the normal page if input length is less than 3
    load_products(role)
  }
}


const load_products = async (role, page) => {
  let categories = "";
  let order = "";

  let sorting = ""
  let response

  try {
    if (page && page != "") {
      response = await products(role, page + sorting);
    } else {
      response = await products(role, "/api/shelf/products" + sorting);
    }

    if (!response) {
      DisplayMessage("An error occurred", "error");
      return
    }

    let html = "";
    let results = "";
    let paginator = "";

    if (response && response.html) {
      html = response.html;
      paginator = response.paginator;
    }

    const product_section = document.getElementById("product_section");
    const pagination_section = document.getElementById("product_pagination");
    product_section.innerHTML = html;
    pagination_section.innerHTML = paginator;

  } catch {
    return
  }
};

async function ProductPage(role) {

  const response = await products(role);

  let html = "";
  let paginator = "";

  if (response && response.html) {
    html = response.html;
    paginator = response.paginator;
  }

  return `<section class="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <!-- Heading & Filters -->
        <div class="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
          <div>
            <nav class="flex" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li class="inline-flex items-center">
                  <div onclick="LoadTab('overview')"
                  class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
                    <svg class="me-2.5 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Home
                  </div>
                </li>
                <li>
                  <div onclick="LoadTab('products')" class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
                    </svg>
                    <a href="#" class="ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white md:ms-2">Products</a>
                  </div>
                </li>
              </ol>
            </nav>
            <div class="flex space-x-2 justify-between items-center flex-nowrap">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Products</h2>
                <form class="flex items-center">
                    <label for="simple-search" class="sr-only">Search</label>
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                            </svg>
                        </div>
                        <input type="text" id="simple-search" placeholder="Search for products" required="" oninput="debounceGetProduct(this, '${role}')"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    </div>
                </form>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button data-modal-toggle="product-filterModal" data-modal-target="product-filterModal" type="button" class="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
              <svg class="-ms-0.5 me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
              </svg>
              Filters
              <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
              </svg>
            </button>
            <button id="product-sortDropdownButton1" data-dropdown-toggle="product-dropdownSort1" type="button" class="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
              <svg class="-ms-0.5 me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4" />
              </svg>
              Sort
              <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
              </svg>
            </button>
            <div id="product-dropdownSort1" class="z-50 hidden w-40 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700" data-popper-placement="bottom">
              <ul class="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400" aria-labelledby="product-sortDropdownButton">
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
        <div id="product_section" class="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 2xl:grid-cols-4">
          ${html}
        </div>

        <div id="product_pagination">
          ${paginator}
        </div>
      </div>
      <!-- Filter modal -->
      <form action="#" method="get" id="product-filterModal" tabindex="-1" aria-hidden="true" class="fixed left-0 right-0 top-0 z-50 hidden h-modal w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full">
        <div class="relative h-full w-full max-w-xl md:h-auto">
          <!-- Modal content -->
          <div class="relative rounded-lg bg-white shadow dark:bg-gray-800">
            <!-- Modal header -->
            <div class="flex items-start justify-between rounded-t p-4 md:p-5">
              <h3 class="text-lg font-normal text-gray-500 dark:text-gray-400">Filters</h3>
              <button type="button" class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="product-filterModal">
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

window.ProductPage = ProductPage;