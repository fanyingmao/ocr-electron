import win32gui
import sys
import win32con
import win32api

def findWindowHandleByName(name):
    hwnd_title = dict()
    def get_all_hwnd(hwnd,mouse):
        if win32gui.IsWindow(hwnd) and win32gui.IsWindowEnabled(hwnd) and win32gui.IsWindowVisible(hwnd):
            hwnd_title.update({hwnd:win32gui.GetWindowText(hwnd)})
    win32gui.EnumWindows(get_all_hwnd, 0)
 
    for h,t in hwnd_title.items():
        if t == name:
            return h
    return -1

def findWindowAllchildHandle(parent):
    if not parent:
        return
    ar = []
    win32gui.EnumChildWindows(parent, lambda hwnd, param: param.append(hwnd),  ar)
    # ar = list(filter(lambda x: win32gui.IsWindowVisible(x),ar))
    ar = list(filter(lambda x: win32gui.GetClassName(x).find('Edit') > -1,ar))
    print(ar)

def inputByHandle(handle,content):
    win32gui.SendMessage(handle, win32con.WM_SETTEXT, None, content)

operatorType = sys.argv[1]
if operatorType == "1":
    windowP = findWindowHandleByName(sys.argv[2])
    win32gui.ShowWindow(windowP,5)
    win32gui.SetForegroundWindow(windowP)
    print(windowP)
elif operatorType == "2":
    findWindowAllchildHandle(int(sys.argv[2]))
elif operatorType == "3":
    win32gui.ShowWindow(int(sys.argv[2]),5)
    inputByHandle(int(sys.argv[2]),sys.argv[3])
elif operatorType == "4":
    windowP = findWindowHandleByName(sys.argv[2])
    win32gui.ShowWindow(windowP,5)
    win32gui.SetForegroundWindow(windowP)
    findWindowAllchildHandle(windowP)
else :
    print(sys.argv[2])
    
                    
                
