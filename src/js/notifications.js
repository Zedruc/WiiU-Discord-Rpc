/**
 * From Zedruc/Mingo [Private]
 * M.S.
 */

var anyNotificationShown;
var queue = [];

function userNotification(title = "", msg = "", timeout = 5) {
    if (anyNotificationShown) {
        queue.push({ _title: title, _msg: msg, _timeout: timeout });
        return console.log(
            `%c[Notifications] Pushed ${queue.length} notifications into the queue`, "color:yellow"
        )
    }
    anyNotificationShown = true;
    if (title.length === 0) throw new NotificationParameterException("Title must not be empty");

    if (document.getElementById("notification-div")) {
        let old_notification = document.getElementById("notification-div");
        old_notification.classList.add("removed");
        setTimeout(() => {
            old_notification.remove();
            return notify(title, msg, timeout * 1000)
        }, 2001);
    } else {
        notify(title, msg, timeout * 1000)
    }
}

function NotificationParameterException(message = "No error message, no message parameter passed") {
    this.message = message;
    this.name = "DialogParameterException";
}

function notify(title, msg, timeout) {

    // create elements
    var notification_div = document.createElement("div");
    notification_div.setAttribute("class", "notification-div");
    notification_div.setAttribute("id", "notification-div");

    var notification_title = document.createElement("p");
    notification_title.setAttribute("class", "notification-title");
    notification_title.setAttribute("id", "notification-title");
    var notification_message = document.createElement("p");
    notification_message.setAttribute("class", "notification-message");
    notification_message.setAttribute("id", "notification-message");

    // set title and message
    notification_title.innerHTML = title;
    notification_message.innerHTML = msg;

    notification_div.appendChild(notification_title);
    notification_div.appendChild(notification_message);
    document.body.appendChild(notification_div);

    setTimeout(() => {
        let old_notification = document.getElementById("notification-div");
        old_notification.classList.add("removed");
        setTimeout(() => {
            old_notification.remove();
        }, 2001);
        anyNotificationShown = false;
        checkQueue();
    }, timeout);
}

function checkQueue() {
    if (queue.length) {
        let nextNotification = queue.shift();
        userNotification(nextNotification._title, nextNotification._msg, nextNotification._timeout);
    }
}