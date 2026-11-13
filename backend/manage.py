#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crm.settings")
    os.environ["DJANGO_SETTINGS_MODULE"] = "crm.settings"
    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        # The above import may fail for some other reason. Ensure that the
        # issue is really that Django is missing to avoid masking other
        # exceptions on Python 2.
        try:
            pass

        except ImportError:
            raise ImportError(
                "无法导入Django。您确定它已安装并且存在于您的PYTHONPATH环境变量中吗？您是否已经激活虚拟环境了？"
            )
        raise
    execute_from_command_line(sys.argv)
