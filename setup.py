import setuptools

setuptools.setup(
    name="zhuangzhuangml",
    version='0.1.0',
    url="https://github.com/Alpaca-Hub/zhuangzhuang-ml",
    author="Tony, Jamie, John and Alexandar, et al.",
    description="A jupyter notebook plugin for machine learning code versioning",
    packages=setuptools.find_packages(),
    install_requires=[
        'psutil',
        'notebook',
        'gitpython'
    ],
    package_data={'zhuangzhuangml': ['static/*']},
)
