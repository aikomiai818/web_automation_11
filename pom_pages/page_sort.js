import { By } from "selenium-webdriver";

class PageSort {

    static list_sort = By.className('product_sort_container');
    static sort_az = By.css('option[value="az"]');
    static sort_za = By.css('option[value="za"]');
    static sort_hilo = By.css('option[value="hilo"]');

}

export default PageSort;