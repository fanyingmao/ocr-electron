import win32gui
import sys
import win32con
import win32api
import time

parser = sys.argv[1]

hwnd_title = dict()
def get_all_hwnd(hwnd,mouse):
    if win32gui.IsWindow(hwnd) and win32gui.IsWindowEnabled(hwnd) and win32gui.IsWindowVisible(hwnd):
        hwnd_title.update({hwnd:win32gui.GetWindowText(hwnd)})
win32gui.EnumWindows(get_all_hwnd, 0)
windowP = 0
for h,t in hwnd_title.items():
    if t == parser:
        windowP = h

# parent为父窗口句柄id
def get_child_windows(parent):
    '''
    获得parent的所有子窗口句柄
     返回子窗口句柄列表
     '''
    if not parent:
        return
    hwndChildList = []
    win32gui.EnumChildWindows(parent, lambda hwnd, param: param.append(hwnd),  hwndChildList)
    return hwndChildList
print('windowP',windowP)

ar = get_child_windows(windowP)
# ar = list(filter(lambda x: win32gui.IsWindowVisible(x),ar))
ar = list(filter(lambda x: win32gui.GetClassName(x).find('Edit') > -1,ar))
print(ar)

num = 0
for item in ar:
    print(num,item)
    win32gui.SetForegroundWindow(int(item))
    win32gui.ShowWindow(item,5)
    time.sleep(1)
    win32gui.SendMessage(int(item), win32con.WM_SETTEXT, None, str(num))
    num += 1

