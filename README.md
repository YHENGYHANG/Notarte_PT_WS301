# Student Registration Form – WS 301 Performance Task

## Files
- `index.html` – form structure, 12 required fields, Submit and Reset buttons, `data-*` attributes
- `style.css` – layout, `.error` / `.valid` states, password strength meter, success banner
- `script.js` – validation, events, `classList`, `dataset`, attribute manipulation

## How to run
Open `index.html` in any browser. No install or server needed.

## Test data for the "Successful Form" screenshot
| Field | Value |
|---|---|
| Student ID | 2026-0001 |
| Full name | Juan Dela Cruz |
| Date of birth | 2005-03-14 |
| Gender | Male |
| Email | juan@school.edu.ph |
| Phone | 0917-123-4567 |
| Address | 12 Rizal St, Poblacion, Tagbilaran City |
| Program / Year | BS Information Technology / 2nd year |
| Password / Confirm | Abcdef12 / Abcdef12 |
| Agreement | checked |

## Screenshot checklist (put these in your .docx, under 3 MB)
1. **Initial form** – page just loaded.
2. **Validation errors** – click Register with the form empty, or type a bad email, phone `123`, and mismatched passwords.
3. **Corrected form** – fix a few fields so some red messages disappear while others remain.
4. **Successful form** – use the test data above and click Register.

## Short explanation (paste into your .docx)
This Student Registration Form collects the student's ID, name, date of birth, gender, email, phone, address, program, year level and password, and it only shows "Registration successful!" when every field is valid. A `submit` listener added with `addEventListener("submit", function(event) { ... })` calls `event.preventDefault()` first, so the page never reloads or submits when validation fails. Each field has its own rule: values are cleaned with `trim()`, the email and phone number are checked with regular expressions (phone format is 09XX-XXX-XXXX), the gender, program and year level must be selected, the confirm password must equal the password, and the agreement box must be ticked. Every invalid field shows its own specific message in a `<p class="error-message">` under the field, instead of one general message. I highlight problems with `classList.add("error")` and remove the styling with `classList.remove("error")` as soon as the input is corrected. I use `classList.toggle("is-active")` on the Show/Hide password button, which also changes the `type` attribute of both password inputs between `password` and `text`. The form uses `data-*` attributes such as `data-label`, `data-format`, `data-min-length` and `data-years`, and JavaScript reads them through `element.dataset` to build error messages and to limit year levels. The attribute manipulation has real purposes: `setAttribute("type")` reveals the password, `setAttribute("disabled")` blocks year levels that a chosen program does not have, and `setAttribute("max")` stops future birth dates. The Reset button clears all values, removes error messages and styling, hides the success message, and returns the password field, counter and year levels to their original state.
