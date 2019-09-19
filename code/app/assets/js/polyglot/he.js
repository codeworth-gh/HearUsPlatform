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
        "link":"אולי יש חבר כנסת שעוד מקושר למפלגה",
        "noWebsite":"לא הוזן אתר למפלגה זו.",
        "editData":"עריכת נתוני מפלגה"
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
    "done":"סיים",
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
        "group":{
            "add":"הועדה הוספה",
            "remove":"הועדה הורדה"
        },
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
    "name":{
        "choose":"בחר/י שם לקמפיין שלך",
        "description":"ניתן לשנות את השם מאוחר יותר"
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
    },
    "tour": {
        "detailsPage":{
            currentSection: {
                title: "מסך עריכת פרטי קמפיין",
                content: "כאן אפשר לערות פרטים כללים של הקמפיין, כמו כותרות או כתובת אינטרנט"
            },
            sampleFieldTitle: {
                title: "שם שדה",
                content: "פרטי הקמפיין מורכבים משדות רבים. השם של השדות האלו מופיע כאן."
            },
            title: {
                title: "שדה ניתן לעריכה",
                content: "כאן ניתן לשנות את ערך השדה (במקרה הזה, את כותרת הקמפיין)."
            },
            sampleFieldHelp: {
                title: "הסבר אודות השדה",
                content: "לנוחותכם, טקסט עזרה קצר מופיע מתחת לכל שדה."
            }
        },
        "messagesPage":{
            section:{
                title:"מסך מסרים",
                content:"כאן עורכים את המסרים עבור חברי הכנסת. מסרים אלו מסודרים לפי עמדה, מדיום ומגדר."
            },
            messageDestinationSelectors:{
                title:"מאפייני היעד",
                content:"המסרים משתנים לפי המדיה, עמדת חבר הכנסת, והמגדר שלו.ה."
            },
            messageTable:{
                title:"טבלת מסרים",
                content:"כאן אפשר לראות אילו מסרים כבר מוכנים (וי ירוק) ואילו מסרים עדיין לא."
            },
            content:{
                title:"עריכת המסר",
                content:"כאן עורכים את המסר עצמו."
            }
        },
        "frontPage":{
            section:{
                title:"מסך עריכה לעמוד הראשי",
                content:"כאן עורכים את הטקסט לעמוד הראשי. לנוחותכם, ליד כל שדה מופיע הסבר לגבי תפקידו בדף."
            },
            sampleHelp:{
                title:"לדוגמא - טקסט העזרה הזה"
            }
        },
        "designPage":{
            section: {
                title:"מסך עיצוב הקמפיין",
                content:"כאן אפשר לבחור צבעים ותמונות לדף הקמפיין, וגם לעצב אותו עם קוד שלכם"
            },
            colors: {
                title:"בחירת צבעים",
                content:"בשורות אלו קובעים את צבעי הקמפיין."
            },
            imageRow: {
                title:"תמונת רקע",
                content:"ניתן לבחור תמונת רקע לקמפיין"
            },
            cssRow: {
                title:"קוד CSS",
                content:"ניתן להוסיף קוד CSS שלכם לקמפיין. קוד זה מאפשר שליטה מלאה על עיצוב הדף. מה שאומר שגם אפשר להרוס איתו דברים - נא להשתמש בזהירות! אם אתם לא מכירים את שפת CSS, כדאי לדבר עם מישהו/י שכן."
            }
        },
        "positionsPage":{
            section: {
                title:"מסך עריכת עמדות הח\"כים",
                content:"כאן עורכים את עמדות חברי הכנסת"
            },
            kmsPositionList: {
                title:"העמדה של כל חבר כנסת",
                content:"ניתן לקבוע את העמדה על ידי בחירת הכפתור המתאים. לחיצה על כפתור ׳עריכה׳ מאפשרת לערוך מידע ספציפי עבור חבר הכנסת. למשל, ראיונות או הסטוריית הצבעה."
            },
            searchStr: {
                title:"סינון רשימה",
                content:"במקום לעבוד קשה בלחפש חבר כנסת ברשימה, אפשר להתחיל להקליד את השם פה."
            }
        },
        "groupsPage":{
            section: {
                title:"מסך בחירת ועדות",
                content:"כאן ניתן לבחור ועדות רלוונטיות לקמפיין. ועדות אלו תוצגנה בדף הראשי"
            },
            groupSearchField: {
                title:"חיפוש ועדה",
                content:"כאן ניתן לחפש ועדות"
            },
            groupTable: {
                title:"טבלת וועדות",
                content:"כאן מופיעות הוועדות הרלוונטיות לקמפיין"
            }

        },
        teamPage:{
            section:{
                title:"מסך בחירת צוות הקמפיין",
                content:"כאן ניתן להוסיף אנשים לצוות הקמפיין, ולערוך את התפקידים שלהם."
            },
            userSearchField:{
                title:"חיפוש משתמשים",
                content:"ניתן לחפש אנשים לפי שם המשתמש שלהם."
            },
            teamTable:{
                title:"צוות הקמפיין",
                content:"צוות הקמפיין מופיע כאן. מנהלי קמפיין יכולים לשנות את תפקידי המשתמשים, ואף לגרוע אותם מהצוות."
            }
        },
        actionsPage:{
            kmName:{
                title:"עריכת פעולות חבר הכנסת",
                content:"כאן ניתן לרשום פעולות של חבר/ת הכנסת שקשורות למטרת הקמפיין."
            },
            addAction: {
                title:"הוספת פעולה",
                content:""
            },
            actionTableNoData: {
                title:"אין כרגע פעולות רשומות",
                content:"כשיהיו כאלו, תופיע כאן טבלה."
            },
            actionTable: {
                title:"טבלת פעולות",
                content:""
            }
        }
    }
});