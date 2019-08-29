/*jshint esversion: 6 */
const polyglot = new Polyglot({locale: "he"});
polyglot.extend({
    "action": {
        "failed": "מחיקת הפעולה %{id} נכשלה",
        "delete":"למחוק פעולה זו?"
    },
    "groups": {
        "campaign":{
            "remove":"להסיר את הועדה '%{name}' מהקמפיין?",
            "failed":"מחיקת הועדה '%{name}' נכשלה"
        },
        "page":{
            "delete":"למחוק ועדה זו?",
            "failed": "מחיקת הועדה נכשלה"
        }
    },
    "campaign":{
        "delete":{
            "warning":"האם את/ה בטוח/ה שברצונך למחוק את הקמפיין?",
            "failed":"מחיקת הקמפיין נכשלה"
        },
        "toReject":"האם את/ה בטוח/ה שברצונך לדחות את הקמפיין?",
        "publish":"מפורסם",
        "reject":"נדחה",
    },
    "invitation": {
        "delete":"האם את/ה בטוח/ה שברצונך למחוק את ההזמנה?",
        "failed":"מחיקת ההזמנה נכשלה",
        "resend":"ההזמנה נשלחה שוב",
        "resend_failed":"השליחה מחדש נכשלה"
    },
    "km":{
        "delete":"האם את/ה בטוח/ה שברצונך למחוק את חבר הכנסת?",
        "failed":"מחיקת חבר הכנסת נכשלה",
        "image":{
            "delete":"האם את/ה בטוח/ה שברצונך למחוק את התמונה של חבר הכנסת?",
            "failed":"מחיקת התמונה נכשלה"
        },
        "contact":{
            "updated":"האפשרות ליצירת קשר עודכנה",
            "one_platform":"כל פלטפורמה יכולה להופיע פעם אחת"
        }
    },
    "party":{
        "delete":"האם את/ה בטוח/ה שברצונך למחוק את המפלגה?",
        "failed":"מחיקת המפלגה נכשלה",
        "link":"אולי יש חבר כנסת שעוד מקושר למפלגה"
    },
    "server_logs_details": "ראה/י לוגים מהשרת",
    "cancel":"ביטול",
    "save":"שמירה",
    "saving":"שומר",
    "confirm":"אישור",
    "cancelRequest":"הבקשה בוטלה",
    "sendToRequest":"הבקשה נשלחה",
    "went_wrong":"משהו השתבש",
    "try_again":"נסה/י שוב",
    "oh":"אוי לא",
    "next":"הבא",
    "prev":"הקודם",
    "team":{
        "myself":{
            "regular_user":{
                "title":"האם להפוך אותך למשתתף/ת רגיל?",
                "text":"את/ה לא תוכל/י לחזור בך מביצוע הפעולה הזאת"
            },
            "remove":{
                "title":"להסיר את עצמך מהקבוצה?",
                "text":"את/ה לא תוכל/י לחזור בך מביצוע הפעולה הזאת"
            }
        },
        "other_regular_user_title":"להפוך את %{name} למשתתף רגיל?",
        "other_remove_title":"להסיר את %{name} מהקבוצה?",
    },
    "update":{
        "design":"מעדכן נתוני עיצוב",
        "details":"מעדכן פרטים",
        "front_page":"מעדכן את העמוד הראשי",
        "messages":"מעדכן מסרים",
        "position":"העמדה שונתה",
        "party":"מעדכן מפלגה",
        "success":"העדכון הצליח",
        "failed":"העדכון נכשל",
    },
    "loading":{
        "messages":"טוען מסרים",
        "failed":"הטעינה נכשלה"
    },
    "slug":{
        "choose":"בחר/י כתובת חדשה לקמפיין שלך",
        "match":"הכתובת צריכה להתאים לתבנית [A-Za-z1-9_-]",
        "exist":"כתובת זו כבר בשימוש",
        "update":"מעדכן את הכתובת"
    },
    "are_you_sure":"האם את/ה בטוח/ה?",
    "operation_undo":"לא ניתן לבטל פעולה זו",
    "image_delete":"התמונה נמחקה",
    "import": {
        "km": "סיימנו לייבא את חברי הכנסת",
        "committees": "סיימנו לייבא וועדות"
    },
    "admin":{
        "upgrade":"עודכן למנהל",
        "remove":"הורד תפקיד המנהל"
    },
    "metaTourSteps":{
        "details": {
            "title":"פרטי הקמפיין",
            "content":"עריכת פרטים כלליים של הקמפיין"
        },
        "messages": {
            "title":"מסרים לחברי הכנסת",
            "content":"עריכת המסרים בקמפיין, לפי מדיה (אימייל/טוויטר), עמדה, ומגדר הח״כ"
        },
        "frontPage": {
            "title":"עמוד ראשי",
            "content":"עריכת הטקסטים בעמוד הראשי של הקמפיין"
        },
        "design": {
            "title":"עיצוב",
            "content":"עיצוב אתר הקמפיין: פונטים, צבעים, ורקעים"
        },
        "knessetMembers": {
            "title":"עמדות הח\"כים",
            "content":"עדכון עמדות חברי הכנסת ביחס לקמפיין"
        },
        "groups": {
            "title":"ועדות",
            "content":"ועדות רלוונטיות לקמפיין"
        },
        "team": {
            "title":"צוות הקמפיין",
            "content":"צוות הקמפיין. מנהלי קמפיין יכולים גם לקבוע את הרכב הצוות"
        }
    }
    // "tour": {
    //     "detailsPage":{
    //         "element":{
    //             "title":"title",
    //             "content":"content"
    //         }
    //     },
    //     "messagesPage":{
    //         "element":{
    //             "title":"title",
    //             "content":"content"
    //         }
    //     },
    //     "frontPage":{
    //         "element":{
    //             "title":"title",
    //             "content":"content"
    //         }
    //     },
    //     "designPage":{
    //         "element":{
    //             "title":"title",
    //             "content":"content"
    //         }
    //     },
    //     "positionsPage":{
    //         "element":{
    //             "title":"title",
    //             "content":"content"
    //         }
    //     },
    //     "groupsPage":{
    //         "element":{
    //             "title":"title",
    //             "content":"content"
    //         }
    //     },
    //     "teamPage":{
    //         "element":{
    //             "title":"title",
    //             "content":"content"
    //         }
    //     },
    //     "actionsPage":{
    //         "element":{
    //             "title":"title",
    //             "content":"content"
    //         }
    //     }
    // }
});